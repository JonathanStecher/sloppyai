import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { atomicWrite, readJson, writeJson, hash, id, safeChild, inside } from './util.mjs';
import { fail } from './errors.mjs';
import { prepareOutput } from './state.mjs';

export async function applyPatches(result, output) {
  const transactionId = id();
  const backupRoot = path.join(output, 'backups', transactionId);
  const changes = [];
  const grouped = new Map();
  for (const patch of result.patches) {
    if (!grouped.has(patch.path)) grouped.set(patch.path, []);
    grouped.get(patch.path).push(patch);
  }
  for (const [relative, patches] of grouped) {
    const file = result.files.find(item => item.path === relative);
    if (!file) fail('PATCH_SCOPE', 'A repair names a file outside the assessed manifest.', 'Re-audit the artifact and regenerate the repair.');
    const destination = await safeChild(result.info.root, relative);
    const current = await readFile(destination);
    if (hash(current) !== file.hash || patches.some(patch => patch.fileHash !== file.hash)) fail('SOURCE_CHANGED', 'A file changed after assessment; no repair was applied to it.', 'Re-audit current source and retry the scoped repair.');
    const ordered = [...patches].sort((a, b) => b.start - a.start || b.end - a.end);
    let upper = file.text.length;
    let changed = file.text;
    for (const patch of ordered) {
      if (!Number.isInteger(patch.start) || !Number.isInteger(patch.end) || patch.start < 0 || patch.end < patch.start || patch.end > upper || typeof patch.replacement !== 'string') fail('INVALID_PATCH', 'Repair edits overlap or have invalid ranges.', 'Re-audit and use non-overlapping source edits.');
      changed = changed.slice(0, patch.start) + patch.replacement + changed.slice(patch.end);
      upper = patch.start;
    }
    if (changed !== file.text) changes.push({ path: relative, beforeHash: file.hash, afterHash: hash(changed), mode: file.mode, before: file.text, after: changed, findingIds: patches.map(item => item.findingId) });
  }
  if (!changes.length) return { id: transactionId, status: 'no_changes', changes: [] };
  const manifest = { schemaVersion: 1, id: transactionId, targetId: result.report.targetId, status: 'prepared', createdAt: new Date().toISOString(), changes: changes.map(({ before: _before, after: _after, ...change }, i) => ({ ...change, backup: String(i) + '.txt' })) };
  for (let i = 0; i < changes.length; i++) await atomicWrite(path.join(backupRoot, String(i) + '.txt'), changes[i].before);
  await writeJson(path.join(backupRoot, 'manifest.json'), manifest);
  let written = 0;
  try {
    for (const change of changes) {
      const destination = await safeChild(result.info.root, change.path);
      if (hash(await readFile(destination)) !== change.beforeHash) fail('SOURCE_CHANGED', 'Source changed before the repair could be committed.', 'Re-audit; inspect the retained transaction before retrying.');
      await atomicWrite(destination, change.after, change.mode);
      written++;
    }
    manifest.status = 'applied';
    await writeJson(path.join(backupRoot, 'manifest.json'), manifest);
  } catch (error) {
    for (const change of changes.slice(0, written).reverse()) {
      const destination = await safeChild(result.info.root, change.path);
      if (hash(await readFile(destination)) === change.afterHash) await atomicWrite(destination, change.before, change.mode);
    }
    manifest.status = 'interrupted';
    await writeJson(path.join(backupRoot, 'manifest.json'), manifest);
    throw error;
  }
  return { id: transactionId, status: 'applied', changes: manifest.changes };
}

export async function undoTransaction(info, output, transactionId) {
  output = await prepareOutput(output);
  if (!/^[a-f0-9-]{36}$/.test(transactionId)) fail('INVALID_TRANSACTION', 'Expected a transaction identifier.', 'Use an identifier listed in the improvement history.');
  const directory = path.join(output, 'backups', transactionId);
  const manifest = await readJson(path.join(directory, 'manifest.json'));
  if (manifest.schemaVersion !== 1 || manifest.targetId !== hash(info.target) || manifest.status !== 'applied' || !Array.isArray(manifest.changes) || manifest.changes.length > 2000) fail('INVALID_TRANSACTION', 'This transaction cannot be restored for the selected target.', 'Check the target, transaction and current state.');
  const prepared = [];
  for (const change of manifest.changes) {
    if (!Number.isInteger(change.mode) || change.mode < 0 || change.mode > 0o777 || !/^[a-f0-9]{64}$/.test(change.beforeHash) || !/^[a-f0-9]{64}$/.test(change.afterHash)) fail('INVALID_BACKUP', 'Backup metadata has invalid permissions or content hashes.', 'Preserve the transaction and inspect it before restoring.');
    const destination = await safeChild(info.root, change.path);
    const backup = path.resolve(directory, change.backup);
    if (!inside(directory, backup) || !/^\d+\.txt$/.test(change.backup)) fail('INVALID_BACKUP', 'A backup path is invalid.', 'Preserve the transaction and investigate it before restoring.');
    await safeChild(directory, change.backup);
    const original = await readFile(backup);
    if (hash(original) !== change.beforeHash) fail('BACKUP_CHANGED', 'A backup no longer matches its recorded source.', 'Preserve both versions and restore manually after review.');
    if (hash(await readFile(destination)) !== change.afterHash) fail('UNDO_CONFLICT', 'A repaired file has subsequent changes; undo would overwrite them.', 'Keep those changes and merge the backup manually.');
    prepared.push({ destination, original, mode: change.mode, afterHash: change.afterHash });
  }
  for (const change of prepared) {
    if (hash(await readFile(change.destination)) !== change.afterHash) fail('UNDO_CONFLICT', 'A repaired file changed during undo preparation.', 'Keep the current file and merge the retained backup manually.');
    await atomicWrite(change.destination, change.original, change.mode);
  }
  manifest.status = 'restored';
  manifest.restoredAt = new Date().toISOString();
  await writeJson(path.join(directory, 'manifest.json'), manifest);
  return { id: transactionId, status: 'restored', restoredFiles: prepared.length };
}
