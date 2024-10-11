import { Injectable } from '@nestjs/common';
import { Worksheet } from 'exceljs';

@Injectable()
export class ExcelService {
  constructor() {}

  writeHeaders(sheet: Worksheet, columns: string[]) {
    const header = sheet.addRow(columns);
    header.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          bgColor: {
            argb: 'FF00FF00',
          },
          fgColor: {
            argb: 'FF000000',
          },
        },
      };
      cell.font = { bold: true };
    });
  }
}
