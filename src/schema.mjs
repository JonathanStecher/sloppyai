import Ajv from 'ajv';
import path from 'node:path';
import { SKILL_ROOT } from './assets.mjs';
import { readJson } from './util.mjs';
import { fail } from './errors.mjs';

const ajv = new Ajv({ allErrors: true, strict: true });
const validators = new Map();

export async function validate(name, value) {
  if (!validators.has(name)) validators.set(name, ajv.compile(await readJson(path.join(SKILL_ROOT, 'schemas', name + '.schema.json'))));
  const validator = validators.get(name);
  if (!validator(value)) {
    const errors = validator.errors.slice(0, 8).map(e => `${e.instancePath || '/'} ${e.message}`);
    fail('INVALID_' + name.toUpperCase(), `Invalid ${name} input.`, 'Correct the named fields using the bundled JSON schema.', { errors });
  }
  return value;
}
