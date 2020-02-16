import { Context } from 'egg';

export interface PreTableConfig {
  guid: string;
  sheets: string[];
  skipRows: number;
  skipColumns: number;
  nameRow: number;
  typeRow: number;
  defaultValueRow: number;
  maxColumn: string;
  preTable?: PreTableConfig;
  preTableDetect?: (row: RowData) => any;
}

export interface TableConfig extends PreTableConfig {
  indexKey: string;
  validation?: (row: any[]) => boolean;
  getFilePath: (sheet: string) => string;
  feParser?: (data: any[], sheet: string, ctx: Context) => Promise<any>;
}

export function getCellByType(row: any[], type: ColumnTypes): any {
  return row.find(cell => cell.type === type);
}

export function getCellByName(row: any[], key: string): any {
  return row.find(cell => cell.key === key);
}

export function getAllCellsByType(row: any[], type: string): any {
  return row.filter(cell => cell.type === type);
}

export const defaultColumnType = 'string';
export const defaultValidation = (row: any[]): boolean => {
  const v = getCellByName(row, '审核状态').value;
  return v !== null && !v.includes('未');
};

export type ColumnTypes = 'string' | 'int' | 'float' | 'url' | 'address' | 'enum' | 'supply' | 'contact' | 'date' | 'supplies';

export interface TableData {
  guid: string;
  data: SheetData[];
}

export interface SheetData {
  sheetName: string;
  data: RowData[];
}

export type RowData = CellData[];

export type CellData = any;
