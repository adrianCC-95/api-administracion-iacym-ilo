import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfPrinterService {
    createPdfBuffer(callback: (doc: PDFKit.PDFDocument) => void): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: 'A4', margin: 30 });
            const chunks: Uint8Array[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', (err) => reject(err));

            callback(doc);

            doc.end();
        });
    }
}
