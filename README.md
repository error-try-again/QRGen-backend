## Backend for QRGen

*This is an optional submodule repository for the backend of QRGen.*

Modify the config.ts to reflect the frontend domain/port - where your requests will come from. 

```typescript
import 'dotenv/config'

export const PORT = process.env['PORT'] || 3001;
export const TRUST_PROXY = 1;
export const JSON_BODY_LIMIT = '1mb';

// Modify this line
// export const ORIGIN = process.env['ORIGIN'] || 'http://localhost:5173';

export const MAX_QR_CODES = 1000;
export const DEFAULT_MARGIN = 1;
export const DEFAULT_QR_SIZE = 150;
export const DEFAULT_QR_PRECISION = 'M';
export const DEFAULT_QR_COLOUR = '#000000';

// Used when being built as a git submodule, ignored otherwise.
export const USE_SSL = process.env['USE_SSL'] === 'true';
export const GOOGLE_MAPS_API_KEY = process.env['GOOGLE_MAPS_API_KEY'] || '';
```

Running the server: 

```bash
npm run main
```

Example:
```
➜  QRGen-backend git:(untested) ✗ npm run main

> qrgen-backend@1.0.0 main
> npx ts-node src/server.ts
```
