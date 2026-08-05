import { IncomeSheetData } from '../entities/income-sheet-report.interface'; // Ajusta tu ruta
import { ASSETS, getImagePath } from '../../../config/constants/paths';
import { existsSync } from 'fs';

export class IncomeSheetPdfBuilder {
    static build(doc: PDFKit.PDFDocument, data: IncomeSheetData): void {
        // --- 1. ENCABEZADO ---
        doc.fontSize(12)
            .font('Helvetica-Bold')
            .text('IGLESIA ALIANZA CRISTIANA Y MISIONERA DEL PERU', { align: 'left' });
        doc.fontSize(8).font('Helvetica').text('PLANILLA DE CONTROL DE TESORERÍA', { align: 'left' });

        // Número correlativo (Arriba a la derecha)
        doc.fontSize(11).fillColor('red').font('Helvetica-Bold').text('Nº 001270', 470, 30, { align: 'right' });
        doc.fillColor('black');

        // Metadatos (Fecha / Culto)
        doc.fontSize(8.5).font('Helvetica-Bold');
        doc.text(`Fecha: ${data.date || ''}`, 30, 65, { align: 'left' });
        doc.text(`Culto / Actividad: ________________________`, 220, 65, { align: 'right' });

        const tableStartY = 82;
        const rowHeight = 16.5; // Altura exacta para meter 29 filas estáticas
        const colWidth = 260; // Ancho de cada columna principal (A y B)

        // --- 2. DIBUJAR COLUMNA A (29 Filas) ---
        const tithesColA = data.tithes.slice(0, 29);
        this.drawTableColumn(doc, 30, tableStartY, 'A', 29, tithesColA, rowHeight, colWidth);

        // --- 3. DIBUJAR COLUMNA B (21 Filas) ---
        const tithesColB = data.tithes.slice(29, 50);
        const colBYEnd = this.drawTableColumn(doc, 305, tableStartY, 'B', 21, tithesColB, rowHeight, colWidth);

        // --- 4. DIBUJAR RESUMEN (Ubicado justo abajo de la Columna B) ---
        this.drawSummaryTable(doc, 305, colBYEnd + 8, data.summary, colWidth);

        // --- 5. DINERO CONTADO POR Y FIRMAS ---
        this.drawSignatures(doc, 735);

        // --- 0. MARCA DE AGUA DE FONDO ---

        this.drawWatermark(doc);
    }

    private static drawTableColumn(
        doc: PDFKit.PDFDocument,
        startX: number,
        startY: number,
        sectionTag: string,
        totalRows: number,
        items: any[],
        rowHeight: number,
        colWidth: number,
    ): number {
        let y = startY;

        // Encabezado de la columna (Nº | NOMBRES Y APELLIDOS | IMPORTE)
        doc.rect(startX, y, colWidth, 15).fill('#e0e0e0');
        doc.rect(startX, y, colWidth, 15).strokeColor('#000000').stroke();

        doc.fillColor('black').fontSize(7.5).font('Helvetica-Bold');
        doc.text('Nº', startX + 3, y + 4, { width: 18, align: 'center' });
        doc.text('NOMBRES Y APELLIDOS', startX + 25, y + 4, { width: 160 });
        doc.text('IMPORTE', startX + 190, y + 3, { width: 65, align: 'right' });
        y += 15;

        // Sub-etiqueta (A ó B)
        doc.rect(startX, y, colWidth, 13).fill('#f2f2f2');
        doc.rect(startX, y, colWidth, 13).strokeColor('#000000').stroke();
        doc.fillColor('black')
            .fontSize(8)
            .font('Helvetica-Bold')
            .text(sectionTag, startX + 5, y + 3);
        y += 13;

        // Bucle para dibujar SIEMPRE las filas estáticas (29 para A, 21 para B)
        for (let i = 0; i < totalRows; i++) {
            const item = items[i];

            // Cuadrícula de la fila
            doc.rect(startX, y, colWidth, rowHeight).strokeColor('#000000').stroke();

            // Dibujar textos si existe el dato en esa posición
            doc.fontSize(7.5).font('Helvetica');
            doc.text((i + 1).toString(), startX + 3, y + 4, { width: 18, align: 'center' });

            if (item) {
                const name = item.memberName || 'Anónimo / General';
                const amount = Number(item.amount || 0).toFixed(2);

                doc.text(name, startX + 25, y + 4, { width: 160, height: 10, lineBreak: false });
                doc.text(amount, startX + 190, y + 4, { width: 65, align: 'right' });
            }

            // Divisores verticales internos de la tabla
            doc.moveTo(startX + 22, y)
                .lineTo(startX + 22, y + rowHeight)
                .stroke();
            doc.moveTo(startX + 188, y)
                .lineTo(startX + 188, y + rowHeight)
                .stroke();

            y += rowHeight;
        }

        return y; // Devuelve el final exacto en Y
    }

    private static drawSummaryTable(
        doc: PDFKit.PDFDocument,
        startX: number,
        startY: number,
        summary: any,
        width: number,
    ): void {
        let y = startY;

        doc.fontSize(7.5).font('Helvetica-Bold');

        // Si existen categorías dinámicas en la BD
        const categories = summary?.categories || [];

        categories.forEach((cat: any) => {
            doc.rect(startX, y, width, 14).strokeColor('#000000').stroke();
            doc.text((cat.name || '').toUpperCase(), startX + 5, y + 3, { width: 170 });
            doc.text(`S/ ${Number(cat.total || 0).toFixed(2)}`, startX + 180, y + 3, { width: 75, align: 'right' });
            y += 14;
        });

        // Fila Total Diezmos
        doc.rect(startX, y, width, 14).strokeColor('#000000').stroke();
        doc.text('TOTAL DIEZMOS', startX + 5, y + 3, { width: 170 });
        doc.text(`S/ ${Number(summary?.totalDiezmos || 0).toFixed(2)}`, startX + 180, y + 3, {
            width: 75,
            align: 'right',
        });
        y += 14;

        // Fila Destacada: TOTAL INGRESOS (S/.)
        doc.rect(startX, y, width, 16).fill('#e0e0e0');
        doc.rect(startX, y, width, 16).strokeColor('#000000').stroke();
        doc.fillColor('black').fontSize(8.5).font('Helvetica-Bold');
        doc.text('TOTAL INGRESOS (S/.):', startX + 5, y + 4, { width: 170 });
        doc.text(`S/ ${Number(summary?.grandTotal || 0).toFixed(2)}`, startX + 180, y + 4, {
            width: 75,
            align: 'right',
        });
    }

    private static drawSignatures(doc: PDFKit.PDFDocument, y: number): void {
        doc.fontSize(8).font('Helvetica-Bold').fillColor('black');

        // Campo: Dinero contado por
        doc.text('DINERO CONTADO POR:', 30, y - 20);

        // Líneas de firma alineadas abajo
        const startY = y + 25;
        doc.font('Helvetica').fontSize(7.5);

        doc.text('_____________________\nTesorería', 30, startY, { width: 120, align: 'center' });
        doc.text('_____________________\nVocal', 165, startY, { width: 120, align: 'center' });
        doc.text('_____________________\nVocal', 300, startY, { width: 120, align: 'center' });
        doc.text('_____________________\nVºBº Pastor', 435, startY, { width: 120, align: 'center' });
    }

    private static drawWatermark(doc: PDFKit.PDFDocument): void {
        const logoPath = getImagePath(ASSETS.logoPlanilla);

        // 1. Validar si el archivo existe antes de que PDFKit intente abrirlo
        if (!existsSync(logoPath)) {
            console.error(`❌ [PDFKit Error] No se encontró el logo en: ${logoPath}`);
            return;
        }

        // 2. Si existe, dibujamos la marca de agua
        doc.save();
        doc.fillOpacity(0.09);

        // Coordenadas para centrarlo en la hoja A4
        const centerX = (595.28 - 250) / 2; // ~172
        const centerY = (841.89 - 250) / 2; // ~295

        doc.image(logoPath, centerX, centerY, { width: 320 });

        doc.restore(); // Restaurar opacidad para las tablas
    }
}
