
import express, { NextFunction, Request, Response, Router } from 'express';
import { generateQRCodesForBatch, processSingleQRCode } from '../controllers/qr-code-controller';
import { prepareAndSendArchive } from './helpers/archival-helpers';
import {
  asyncErrorHandler,
  validateBatchRequest,
  validateRequest
} from '../validators/validate-request-body';
import { handleSearchAutocomplete, reverseGeocodeLatLng } from '../services/retrieve-place';

const router: Router = express.Router();

router.post('/generate', asyncErrorHandler(async (request: Request, response: Response, next: NextFunction) => {
  await validateRequest(request, response, next).then(async () => {
    const { body } = request;
    const { qrData } = await processSingleQRCode({ qrData: body });
    response.json({ qrCodeURL: qrData });
  });
}));

router.post('/batch', asyncErrorHandler(async (request, response, next) => {
  try {
    await validateBatchRequest(request, response, next);
    const { body } = request;
    const qrData = await generateQRCodesForBatch(body);
    if (!response.headersSent && qrData.length > 0) {
      await prepareAndSendArchive(qrData, response);
    } else if(response.headersSent) {
      console.error("Cannot proceed with sending archive as headers are already sent");
    }
  } catch (error) {
    console.error("Error in /batch route:", error);
    next(error);
  }
}));

router.post('/places', asyncErrorHandler(async (request: Request, response: Response) => {
  const { body: { latitude, longitude } } = request;
  await reverseGeocodeLatLng(latitude, longitude).then((place) => {
    response.json({ place });
  });
}));

router.post('/autocomplete', asyncErrorHandler(async (request: Request, response: Response) => {
  const { body: { location } } = request;
  await handleSearchAutocomplete(location).then((searchResponse) => {
    response.json({ searchResponse });
  });
}));

router.get('/health', asyncErrorHandler(async (_: Request, response: Response) => {
  response.json({ status: 'ok' });
}));

export { router as qrCodeRoutes };
