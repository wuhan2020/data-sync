export interface TableConfig {
  guid: string;
  sheets: string[];
  skipRows: number;
  skipColumns: number;
  nameRow: number;
  typeRow: number;
  defaultValueRow: number;
  maxColumn: string;
  indexKey: string;
  validation?: (row: any[]) => boolean;
  getFilePath: (sheet: string) => string;
  feParser?: (data: any[], sheet: string) => any;
}

export const defaultColumnType = 'string';
export const defaultValidation = (row: any[]): boolean => {
  return row.some(item => item.key === '审核状态' && item.value !== null);
};

export function getCellByType(row: any[], type: string): any {
  return row.find(cell => cell.type === type);
}

export function getCellByName(row: any[], key: string): any {
  return row.find(cell => cell.key === key);
}

export function getAllCellsByType(row: any[], type: string): any {
  return row.filter(cell => cell.type === type);
}
