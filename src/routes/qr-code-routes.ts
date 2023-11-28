import express, {Request, Response, Router} from 'express';
import {
    generateQRCodesForBatch,
    processSingleQRCode
} from '../controllers/qr-code-controller.ts';
import {prepareAndSendArchive} from './helpers/archival-helpers.ts';
import {
    validateBatchRequest,
    validateRequest
} from '../validators/validate-request-body.ts';
import {asyncErrorHandler} from '../middleware/async-error-handler.ts';

const router: Router = express.Router();

router.post(
    '/generate',
    asyncErrorHandler(async (request: Request, response: Response) => {
        validateRequest(request, async () => {
            const {body} = request;
            const processedQRCode = await processSingleQRCode({qrData: body});
            response.json({qrCodeURL: processedQRCode.qrCodeData});
        });
    })
);

router.post(
    '/batch',
    asyncErrorHandler(async (request: Request, response: Response) => {
        validateBatchRequest(request, async () => {
            const {body} = request;
            const {qrCodes} = body;
            const qrData = await generateQRCodesForBatch({qrData: qrCodes});
            if (qrData.length > 0) {
                await prepareAndSendArchive(qrData, response);
            }
        });
    })
);

router.get('/health', asyncErrorHandler(async (_: Request, response: Response) => {
    response.json({status: 'ok'});
}));

export {router as qrCodeRoutes};
