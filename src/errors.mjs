export class SloppyAIError extends Error {
  constructor(code, message, fix, context = {}) {
    super(message);
    this.name = 'SloppyAIError';
    this.code = code;
    this.fix = fix;
    this.context = context;
  }
  toJSON() {
    return { code: this.code, message: this.message, fix: this.fix, context: this.context };
  }
}

export function fail(code, message, fix, context) {
  throw new SloppyAIError(code, message, fix, context);
}
