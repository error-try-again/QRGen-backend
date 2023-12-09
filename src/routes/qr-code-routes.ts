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
    const { qrCodeData } = await processSingleQRCode({ qrData: body });
    response.json({ qrCodeURL: qrCodeData });
  });
}));

router.post('/batch', asyncErrorHandler(async (request: Request, response: Response) => {
  await validateBatchRequest(request, response, async () => {
    const { body } = request;
    const { qrCodes } = body;
    const qrData = await generateQRCodesForBatch({ qrData: qrCodes });
    if (qrData.length > 0) {
      await prepareAndSendArchive(qrData, response);
    }
  });
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
