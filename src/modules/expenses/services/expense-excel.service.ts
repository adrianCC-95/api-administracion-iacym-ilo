import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { Expense } from '../models/expense-model';
import { ExportExpenseCriteriaDto } from '../dto/export-expense-criteria.dto';

@Injectable()
export class ExpenseExcelService {
    async generateExcelResponse(expenses: Expense[], criteria: ExportExpenseCriteriaDto, res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Sistema de Gestión';
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet('Egresos', {
            views: [{ showGridLines: true }],
        });

        worksheet.mergeCells('A1:K1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = 'REPORTES DE EGRESOS Y GASTOS';
        titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFF' } };
        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '1B365D' },
        };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).height = 40;

        worksheet.getCell('A3').value = 'Fecha de Generación:';
        worksheet.getCell('A3').font = { bold: true, size: 10 };
        worksheet.getCell('B3').value = new Date().toLocaleString();
        worksheet.getCell('B3').font = { size: 10 };

        if (criteria.dateFrom || criteria.dateTo) {
            worksheet.getCell('A4').value = 'Rango de Fechas:';
            worksheet.getCell('A4').font = { bold: true, size: 10 };
            const from = criteria.dateFrom ? new Date(criteria.dateFrom).toLocaleDateString() : 'Inicio';
            const to = criteria.dateTo ? new Date(criteria.dateTo).toLocaleDateString() : 'Fin';
            worksheet.getCell('B4').value = `${from} - ${to}`;
            worksheet.getCell('B4').font = { size: 10 };
        }

        const headers = [
            'ID',
            'Título del Egreso',
            'Sede',
            'Ministerio',
            'Fecha Egreso',
            'Proveedor / Beneficiario',
            'Tipo Comprobante',
            'N° Comprobante',
            'Tipo de Gasto',
            'Método de Pago',
            'Monto (S/)',
        ];

        const headerRow = worksheet.getRow(6);
        headerRow.values = headers;
        headerRow.height = 25;

        headerRow.eachCell((cell) => {
            cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '2C4D75' },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'medium', color: { argb: '1B365D' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
            };
        });

        let currentRow = 7;

        expenses.forEach((expense) => {
            if (expense.details && expense.details.length > 0) {
                expense.details.forEach((detail) => {
                    const row = worksheet.getRow(currentRow);
                    row.values = [
                        expense.id,
                        expense.title,
                        expense.location?.name || 'N/A',
                        expense.ministry?.name || 'Gasto General',
                        new Date(expense.expenseDate).toLocaleDateString('es-PE'),
                        detail.supplierOrBeneficiary,
                        detail.voucherType,
                        detail.voucherNumber || 'S/N',
                        detail.expenseType?.name || 'N/A',
                        detail.paymentMethod?.name || 'N/A',
                        Number(detail.amount),
                    ];

                    // Formato de Celda
                    row.getCell(11).numFmt = '"S/"#,##0.00';

                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        cell.font = { name: 'Calibri', size: 10 };
                        cell.border = {
                            top: { style: 'thin', color: { argb: 'E0E0E0' } },
                            bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
                            left: { style: 'thin', color: { argb: 'E0E0E0' } },
                            right: { style: 'thin', color: { argb: 'E0E0E0' } },
                        };

                        // Alineaciones específicas
                        if ([1, 5, 7, 8].includes(colNumber)) {
                            cell.alignment = { horizontal: 'center', vertical: 'middle' };
                        } else if (colNumber === 11) {
                            cell.alignment = { horizontal: 'right', vertical: 'middle' };
                        } else {
                            cell.alignment = { horizontal: 'left', vertical: 'middle' };
                        }
                    });

                    currentRow++;
                });
            }
        });

        const totalRow = worksheet.getRow(currentRow);
        worksheet.mergeCells(`A${currentRow}:J${currentRow}`);
        const totalLabelCell = worksheet.getCell(`A${currentRow}`);
        totalLabelCell.value = 'TOTAL GENERAL EGRESOS:';
        totalLabelCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: '1B365D' } };
        totalLabelCell.alignment = { horizontal: 'right', vertical: 'middle' };

        const totalAmountCell = totalRow.getCell(11);
        totalAmountCell.value = {
            formula: `SUM(K7:K${currentRow - 1})`,
            result: expenses.reduce((acc, exp) => acc + exp.details.reduce((dAcc, d) => dAcc + Number(d.amount), 0), 0),
        };
        totalAmountCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: '1B365D' } };
        totalAmountCell.numFmt = '"S/"#,##0.00';
        totalAmountCell.alignment = { horizontal: 'right', vertical: 'middle' };

        totalRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
                top: { style: 'thin', color: { argb: '1B365D' } },
                bottom: { style: 'double', color: { argb: '1B365D' } },
            };
        });

        worksheet.columns.forEach((column) => {
            let maxLen = 10;
            column.eachCell?.({ includeEmpty: false }, (cell, rowNumber) => {
                if (rowNumber === 1) return;

                const len = cell.value ? cell.value.toString().length : 0;
                if (len > maxLen) maxLen = len;

                cell.alignment = { ...cell.alignment, wrapText: true };
            });

            column.width = Math.min(maxLen + 2, 22);
        });

        const fileName = `Reporte_Egresos_${new Date().toISOString().split('T')[0]}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        await workbook.xlsx.write(res);
        res.end();
    }
}
