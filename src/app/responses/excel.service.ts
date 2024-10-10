import { Injectable } from "@nestjs/common";
import { Workbook, Worksheet } from "exceljs";



@Injectable()
export class ExcelService{
    constructor(){}

    writeHeaders(sheet:Worksheet,columns:string[]){
        const header=sheet.addRow(columns)
    }

}