// Product audits avoid treating intentionally unsafe test fixtures as production.
export function isTestFixture(path) {
  return /(?:^|\/)(?:tests?|__tests__|fixtures?)(?:\/|$)|\.(?:test|spec)\.[^.]+$/i.test(path);
}
