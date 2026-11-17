import path from 'node:path';
import { isTestFixture } from './checks/scope.mjs';

const languages = {
  html: 'HTML', htm: 'HTML', css: 'CSS', scss: 'SCSS', sass: 'Sass', less: 'Less',
  js: 'JavaScript', cjs: 'JavaScript', mjs: 'JavaScript', jsx: 'JSX', ts: 'TypeScript',
  tsx: 'TSX', vue: 'Vue', svelte: 'Svelte', astro: 'Astro', php: 'PHP', twig: 'Twig',
  ejs: 'EJS', erb: 'ERB', razor: 'Razor', cshtml: 'Razor', hbs: 'Handlebars',
  py: 'Python', rb: 'Ruby', go: 'Go', rs: 'Rust', java: 'Java', kt: 'Kotlin',
  kts: 'Kotlin', swift: 'Swift', dart: 'Dart', cs: 'C#', fs: 'F#', vb: 'Visual Basic',
  cpp: 'C++', cc: 'C++', hpp: 'C++', c: 'C', h: 'C', ex: 'Elixir', exs: 'Elixir',
  sh: 'Shell', bash: 'Shell', ps1: 'PowerShell', sql: 'SQL', json: 'JSON',
  jsonc: 'JSONC', yaml: 'YAML', yml: 'YAML', toml: 'TOML', xml: 'XML',
  md: 'Markdown', txt: 'Text', r: 'R', scala: 'Scala', lua: 'Lua', zig: 'Zig',
  tf: 'Terraform', gql: 'GraphQL', graphql: 'GraphQL'
};
const markup = /\.(?:html?|jsx|tsx|vue|svelte|astro|razor|cshtml|twig|ejs|hbs|erb|blade\.php)$/i;
const nativeUi = /(?:SwiftUI|androidx\.compose|package:flutter\/|IonicModule)/;
const servicePaths = /(?:^|\/)(?:api|backend|server|services?|workers?|functions|controllers|routers?|middleware|supabase|migrations)(?:\/|[.-])/i;
const uiPaths = /(?:^|\/)(?:components?|views?|screens?|templates?|pages|frontend|ui)(?:\/|[.-])/i;
const staticLanguages = new Set(['HTML', 'CSS', 'JavaScript', 'JSX', 'TypeScript', 'TSX', 'Python', 'SQL', 'Markdown', 'Text']);

export function inventoryOf(files) {
  const totals = new Map();
  let uiFiles = 0;
  let backendFiles = 0;
  let testFiles = 0;
  let builtInFiles = 0;
  for (const file of files) {
    const extension = path.extname(file.path).slice(1).toLowerCase();
    const language = Object.hasOwn(languages, extension) ? languages[extension] : /^Dockerfile(?:\.|$)/i.test(path.basename(file.path)) ? 'Dockerfile' : 'Other UTF-8';
    totals.set(language, (totals.get(language) || 0) + 1);
    if (isTestFixture(file.path)) { testFiles++; continue; }
    if (markup.test(file.path) || uiPaths.test(file.path) || nativeUi.test(file.text.slice(0, 8000))) uiFiles++;
    if (servicePaths.test(file.path) || ['SQL', 'Python', 'Go', 'Rust', 'Java', 'C#', 'Elixir'].includes(language)) backendFiles++;
    if (staticLanguages.has(language)) builtInFiles++;
  }
  return {
    languages: [...totals].sort(([a], [b]) => a.localeCompare(b)).map(([name, files]) => ({ name, files })),
    uiFiles, backendFiles, testFiles, builtInFiles
  };
}
