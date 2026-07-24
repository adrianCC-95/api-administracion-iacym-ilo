import { Injectable } from '@nestjs/common';
import * as Workbook from 'exceljs';
import { Response } from 'express';
import { Member } from '../models/member.model';
import { ExportMemberCriteriaDto } from '../dto/export-member-criteria.dto';

@Injectable()
export class MemberExcelService {
    async generateExcelResponse(incomes: Member[], criteria: ExportMemberCriteriaDto, res: Response): Promise<void> {
        const workbook = new Workbook.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Miembros de la Iglesia');

        // Mostrar líneas de cuadrícula
        worksheet.views = [{ showGridLines: true }];

        // Paleta de colores y estilos
        const NAVY_COLOR = '1F4E78';
        const LIGHT_BLUE_FILL = 'E6EEF8';
        const GRAY_BORDER = 'D9D9D9';

        // ----------------------------------------------------
        // 1. TÍTULO DINÁMICO SEGÚN RANGO DE FECHAS
        // ----------------------------------------------------
        const dateFromStr = criteria.startDate ? new Date(criteria.startDate).toLocaleDateString('es-ES') : null;
        const dateToStr = criteria.endDate ? new Date(criteria.endDate).toLocaleDateString('es-ES') : null;

        let mainTitle = 'REPORTE GENERAL DE MIEMBROS DE LA IGLESIA';
        if (dateFromStr && dateToStr) {
            mainTitle = `REPORTE DE MIEMBROS DEL ${dateFromStr} AL ${dateToStr}`;
        } else if (dateFromStr) {
            mainTitle = `REPORTE DE MIEMBROS DESDE EL ${dateFromStr}`;
        } else if (dateToStr) {
            mainTitle = `REPORTE DE MIEMBROS HASTA EL ${dateToStr}`;
        }

        worksheet.mergeCells('A1:I1');
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
            { header: 'Miembro', key: 'memberName', width: 30, align: 'left' },
            { header: 'Fecha cumpleaños', key: 'birthDate', width: 18, align: 'center' },
            { header: 'Correo', key: 'email', width: 30, align: 'left' },
            { header: 'Telefono', key: 'phone', width: 15, align: 'left' },
            { header: 'Sede', key: 'sede', width: 15, align: 'left' },
            { header: 'Cargo', key: 'cargo', width: 15, align: 'left' },
            { header: 'Ministerio', key: 'ministerio', width: 15, align: 'left' },
            { header: 'Fecha de creacion', key: 'createdAt', width: 18, align: 'center' },
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

        incomes.forEach((member, index) => {
            const currentRowNum = startRowData + index;
            const row = worksheet.getRow(currentRowNum);
            row.height = 20;

            row.getCell(1).value = member.id;
            row.getCell(2).value = member.name;
            row.getCell(3).value = member.birthDate ? new Date(member.birthDate).toLocaleDateString('es-ES') : null;
            row.getCell(4).value = member.email;
            row.getCell(5).value = member.phone;
            row.getCell(6).value = member.location.name;
            row.getCell(7).value = member.position.name;
            row.getCell(8).value = member.ministries.map((m) => m.name).join(', ');
            row.getCell(9).value = member.createdAt ? new Date(member.createdAt).toLocaleDateString('es-ES') : null;

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
        });

        // ----------------------------------------------------
        // 5. DESCARGA DEL ARCHIVO
        // ----------------------------------------------------
        const fileName = `Reporte_Miembros_${new Date().toISOString().slice(0, 10)}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        await workbook.xlsx.write(res);
        res.end();
    }
}
