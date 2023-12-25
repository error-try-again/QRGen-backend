import { ProcessedQRData } from '../../ts/interfaces/helper-interfaces';
import { AllRequests } from '../../ts/types/all-request-types';
import { Response } from 'express';
import archiver, { Archiver } from 'archiver';
import { ErrorType } from '../../ts/enums/error-enum';

async function setArchiveHeaders(response: Response) {
    if (response.headersSent) {
        console.error('Attempted to set headers, but they were already sent.');
        throw new Error('Headers already sent');
    }
    try {
        const dateStamp = new Date().toISOString().slice(0, 19).replaceAll(':', '-');
        response.setHeader(
            'Content-Disposition',
            `attachment; filename=bulk_qr_${dateStamp}.zip`
        );
    } catch (error) {
        console.error('Error setting headers:', error);
        throw new Error('Error occurred while setting headers');
    }
}


export async function prepareAndSendArchive(
  qrCodes: ProcessedQRData<AllRequests>[],
  response: Response
) {
    const archive = archiver('zip');
    try {
        await setArchiveHeaders(response);
        archive.pipe(response);

        // Append QR codes to the archive
        appendQRCodesToArchive({ qrCodes, archive });

        // Logging before finalizing
        console.log("Finalizing archive");
        await archive.finalize();
        console.log("Archive has been finalized");
    } catch (error) {
        console.error('Error during archiving:', error);
        if (!response.headersSent) {
            response.status(500).send('Error generating archive');
        }
    }
}


function appendQRCodesToArchive({
                                  qrCodes,
                                  archive
                                }: {
  archive: Archiver;
  qrCodes: ProcessedQRData<AllRequests>[];
}) {
  // Append QR codes to archive with a unique name for each file
  for (const [index, qrCode] of qrCodes.entries()) {
    let buffer = Buffer.from('');
    let fileName = '';

    try {
      // Ensure qrCode.qrData is a string and starts with the expected format
      if (qrCode.qrData.startsWith('data:image/png;base64,')) {
        buffer = Buffer.from(qrCode.qrData.split(',')[1], 'base64');
        fileName = `${qrCode.type}_${index}.png`;
      }
    } catch {
      throw new Error(
        `QR code at index ${index} is not in the expected format.`
      );
    }

    try {
      if (buffer.length > 0 && fileName.length > 0) {
        archive.append(buffer, { name: fileName });
      }
    } catch {
      throw new TypeError(ErrorType.ERROR_APPENDING_FILES);
    }
  }
}
