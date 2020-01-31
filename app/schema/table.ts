export interface TableConfig {
  guid: string;
  name: string;
  sheets: string[];
  skipRows: number;
  skipColumns: number;
  nameRow: number;
  typeRow: number;
  defaultValueRow: number;
  validation?: (row: any[]) => boolean;
}

export const defaultColumnType = 'string';
export const defaultValidation = (row: any[]): boolean => {
  return row.some(item => item.key === '审核状态' && item.value !== null);
};
