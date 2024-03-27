import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { qrCodeRoutes } from './routes/qr-code-routes';
import { JSON_BODY_LIMIT, ORIGIN, PORT, TRUST_PROXY } from './config';
import { rateLimiters } from './middleware/rate-limiters';
import dotenv from 'dotenv';
import http from 'node:http';

// Initialize express
export const app = express();

// Initialize dotenv
dotenv.config({ path: './.env' });
console.log('Environment Variables:', process.env);

// Middleware Setup
app.set('trust proxy', TRUST_PROXY);
app.use(
  helmet(),
  cors({ origin: ORIGIN, optionsSuccessStatus: 200 }),
  express.json({ limit: JSON_BODY_LIMIT })
);

app.use('/generate', rateLimiters.singleQRCode);
app.use('/batch', rateLimiters.batchQRCode);

// Routes
app.use('/qr', qrCodeRoutes);

export const ssl = process.env['USE_SSL'] === 'true';
console.log('USE_SSL:', ssl);


// Start HTTPS Server
const startHttpsServer = () => {
  import('node:fs')
  .then(fs => {
    import('node:https').then(https => {
      const sslOptions = {
        key: fs.readFileSync('/etc/ssl/certs/privkey.pem'),
        cert: fs.readFileSync('/etc/ssl/certs/fullchain.pem')
      };
      https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`HTTPS server running on https://localhost:${PORT}`);
      });
    });
  })
  .catch(error => {
    console.error('Failed to start HTTPS server:', error);
  });
};

const startHttpServer = () => {
  http.createServer(app).listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`);
  });
};

// Start server based on SSL configuration
if (process.env.NODE_ENV !== 'test') {
  if (ssl) {
    startHttpsServer();
  } else {
    startHttpServer();
  }
}