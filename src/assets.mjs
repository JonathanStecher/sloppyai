import { fileURLToPath } from 'node:url';

export const SKILL_ROOT = fileURLToPath(new URL(
  typeof __SLOPPYAI_BUNDLE__ !== 'undefined' ? '../' : '../skills/sloppyai/',
  import.meta.url
));
export const VERSION = '0.2.0';
export const DOMAINS = ['accessibility', 'ux', 'copy', 'performance', 'security', 'engineering', 'design', 'media', 'rights', 'devex'];
export const SEVERITIES = ['critical', 'high', 'medium', 'low', 'suggestion'];
export const PENALTIES = { critical: 25, high: 12, medium: 6, low: 2, suggestion: 0 };
