import { Injectable } from '@nestjs/common';
import * as Workbook from 'exceljs';
import { Response } from 'express';
import { Income } from '../models/income.model';
import { ExportIncomeCriteriaDto } from '../dto/export-income-criteria.dto';

@Injectable()
export class IncomeExcelService {
    async generateExcelResponse(incomes: Income[], criteria: ExportIncomeCriteriaDto, res: Response): Promise<void> {
        const workbook = new Workbook.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Ingresos');

        // Mostrar líneas de cuadrícula
        worksheet.views = [{ showGridLines: true }];

        // Paleta de colores y estilos
        const NAVY_COLOR = '1F4E78';
        const LIGHT_BLUE_FILL = 'E6EEF8';
        const GRAY_BORDER = 'D9D9D9';

        // ----------------------------------------------------
        // 1. TÍTULO DINÁMICO SEGÚN RANGO DE FECHAS
        // ----------------------------------------------------
        const dateFromStr = criteria.dateFrom ? new Date(criteria.dateFrom).toLocaleDateString('es-ES') : null;
        const dateToStr = criteria.dateTo ? new Date(criteria.dateTo).toLocaleDateString('es-ES') : null;

        let mainTitle = 'REPORTE GENERAL DE INGRESOS';
        if (dateFromStr && dateToStr) {
            mainTitle = `REPORTE DE INGRESOS DEL ${dateFromStr} AL ${dateToStr}`;
        } else if (dateFromStr) {
            mainTitle = `REPORTE DE INGRESOS DESDE EL ${dateFromStr}`;
        } else if (dateToStr) {
            mainTitle = `REPORTE DE INGRESOS HASTA EL ${dateToStr}`;
        }

        worksheet.mergeCells('A1:H1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = mainTitle;
        titleCell.font = { name: 'Calibri', size: 15, bold: true, color: { argb: NAVY_COLOR } };
        titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
        worksheet.getRow(1).height = 25;

        worksheet.getCell('A2').value = `Generado el: ${new Date().toLocaleDateString('es-ES')}`;
        worksheet.getCell('A2').font = { name: 'Calibri', size: 10, italic: true, color: { argb: '595959' } };
        worksheet.getRow(2).height = 18;

        // ----------------------------------------------------
        // 2. CONFIGURACIÓN DE ENCABEZADOS Y COLUMNAS
        // ----------------------------------------------------
        const headers = [
            { header: 'ID', key: 'id', width: 10, align: 'center' },
            { header: 'Fecha (Mes/Año)', key: 'incomeDate', width: 18, align: 'center' },
            { header: 'Miembro / Cliente', key: 'memberName', width: 30, align: 'left' },
            { header: 'Tipo de Ingreso', key: 'incomeType', width: 25, align: 'left' },
            { header: 'Método de Pago', key: 'paymentMethod', width: 22, align: 'left' },
            { header: 'Monto', key: 'amount', width: 18, align: 'right' },
            { header: 'N° Referencia', key: 'referenceNumber', width: 20, align: 'center' },
            { header: 'Registrado Por', key: 'registeredBy', width: 25, align: 'left' },
        ];

        const headerRowIndex = 4;
        const headerRow = worksheet.getRow(headerRowIndex);
        headerRow.height = 26;

        headers.forEach((h, index) => {
            const colNumber = index + 1;
            const cell = headerRow.getCell(colNumber);
            cell.value = h.header;
            cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: NAVY_COLOR },
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getColumn(colNumber).width = h.width;
        });

        // ----------------------------------------------------
        // 3. INSERCIÓN DE DATOS
        // ----------------------------------------------------
        const startRowData = 5;

        incomes.forEach((income, index) => {
            const currentRowNum = startRowData + index;
            const row = worksheet.getRow(currentRowNum);
            row.height = 20;

            const memberFullName = income.member
                ? `${income.member.name || ''} ${income.member.lastName || ''}`.trim()
                : 'N/A';

            const registeredByName = income.registeredBy ? income.registeredBy.name : 'N/A';

            // Formatear la fecha a solo MES y AÑO (ej. 05/2026)
            let formattedMonthYear = '-';
            if (income.incomeDate) {
                const d = new Date(income.incomeDate);
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                formattedMonthYear = `${month}/${year}`;
            }

            row.getCell(1).value = income.id;
            row.getCell(2).value = formattedMonthYear;
            row.getCell(3).value = memberFullName;
            row.getCell(4).value = income.incomeType?.name || 'N/A';
            row.getCell(5).value = income.paymentMethod?.name || 'N/A';
            row.getCell(6).value = income.amount;
            row.getCell(7).value = income.referenceNumber || '-';
            row.getCell(8).value = registeredByName;

            // Formato visual de celdas
            headers.forEach((h, i) => {
                const cell = row.getCell(i + 1);
                cell.font = { name: 'Calibri', size: 10 };
                cell.alignment = { horizontal: h.align as any, vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin', color: { argb: GRAY_BORDER } },
                    left: { style: 'thin', color: { argb: GRAY_BORDER } },
                    bottom: { style: 'thin', color: { argb: GRAY_BORDER } },
                    right: { style: 'thin', color: { argb: GRAY_BORDER } },
                };
            });

            // Formato de moneda para el Monto (Columna 6)
            row.getCell(6).numFmt = '"S/"#,##0.00;("S/"#,##0.00);"-"';
        });

        // ----------------------------------------------------
        // 4. FILA DE MONTO TOTAL GENERAL
        // ----------------------------------------------------
        const totalRowIndex = startRowData + incomes.length;
        const totalRow = worksheet.getRow(totalRowIndex);
        totalRow.height = 24;

        // Combinar celdas A hasta E para la etiqueta
        worksheet.mergeCells(totalRowIndex, 1, totalRowIndex, 5);
        const labelCell = totalRow.getCell(1);
        labelCell.value = 'TOTAL GENERAL';
        labelCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: NAVY_COLOR } };
        labelCell.alignment = { horizontal: 'right', vertical: 'middle' };

        // Celda con Fórmula de Suma Excel para la Columna F (Monto)
        const totalAmountCell = totalRow.getCell(6);
        const lastDataRowIndex = totalRowIndex - 1;
        totalAmountCell.value = {
            formula: `SUM(F${startRowData}:F${lastDataRowIndex < startRowData ? startRowData : lastDataRowIndex})`,
        };
        totalAmountCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: NAVY_COLOR } };
        totalAmountCell.alignment = { horizontal: 'right', vertical: 'middle' };
        totalAmountCell.numFmt = '"S/"#,##0.00;("S/"#,##0.00);"-"';

        // Estilar la fila completa de Total (Fondo y Bordes Dobles)
        for (let col = 1; col <= 8; col++) {
            const cell = totalRow.getCell(col);
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: LIGHT_BLUE_FILL },
            };
            cell.border = {
                top: { style: 'thin', color: { argb: NAVY_COLOR } },
                bottom: { style: 'double', color: { argb: NAVY_COLOR } },
                left: { style: 'thin', color: { argb: GRAY_BORDER } },
                right: { style: 'thin', color: { argb: GRAY_BORDER } },
            };
        }

        // ----------------------------------------------------
        // 5. DESCARGA DEL ARCHIVO
        // ----------------------------------------------------
        const fileName = `Reporte_Ingresos_${new Date().toISOString().slice(0, 10)}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        await workbook.xlsx.write(res);
        res.end();
    }
}
