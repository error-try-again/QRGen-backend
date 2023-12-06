import express, {NextFunction, Request, Response, Router} from 'express';
import {generateQRCodesForBatch, processSingleQRCode} from '../controllers/qr-code-controller.ts';
import {prepareAndSendArchive} from './helpers/archival-helpers.ts';
import {
    asyncErrorHandler,
    validateBatchRequest,
    validateRequest
} from '../validators/validate-request-body.ts';
import {handleSearchAutocomplete, reverseGeocodeLatLng} from "../services/retrieve-place.ts";

const router: Router = express.Router();

router.post('/generate', asyncErrorHandler(async (request: Request, response: Response, next: NextFunction) => {
    await validateRequest(request, response, next).then(async () => {
        const {body} = request;
        const processedQRCode = await processSingleQRCode({qrData: body});
        response.json({qrCodeURL: processedQRCode.qrCodeData});
    });
}));

router.post('/batch', asyncErrorHandler(async (request: Request, response: Response) => {
    await validateBatchRequest(request, response, async () => {
        const {body} = request;
        const {qrCodes} = body;
        const qrData = await generateQRCodesForBatch({qrData: qrCodes});
        if (qrData.length > 0) {
            await prepareAndSendArchive(qrData, response);
        }
    });
}));

router.post('/places', asyncErrorHandler(async (request: Request, response: Response) => {
    const {body: {latitude, longitude}} = request;
    await reverseGeocodeLatLng(latitude, longitude).then((place) => {
        response.json({place});
    });
}));

router.post('/autocomplete', asyncErrorHandler(async (request: Request) => {
    const {body: {location}} = request;
    await handleSearchAutocomplete(location).then((response) => {
        response.json({response});
    });
}));

router.get('/health', asyncErrorHandler(async (_: Request, response: Response) => {
    response.json({status: 'ok'});
}));

export {router as qrCodeRoutes};
