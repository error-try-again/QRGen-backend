export const PORT = process.env['PORT'] || 3001;
export const TRUST_PROXY = 1;
export const JSON_BODY_LIMIT = '1mb';
export const ORIGIN = process.env['ORIGIN'] || 'http://localhost:8080';
export const MAX_QR_CODES = 1000;
export const DEFAULT_QR_SIZE = 150;

// Used when being built as a git submodule, ignored otherwise.
// noinspection JSUnusedGlobalSymbols
export const USE_SSL = process.env['USE_SSL'] === 'true';
