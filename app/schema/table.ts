export interface TableConfig {
  guid: string;
  sheets: string[];
  skipHead: number;
  name: string;
  columns: {
    name: string;
    type?: 'address' | 'contact' | 'url' | 'int' | 'float' | 'string' | 'date' | 'supply' | 'enum' | undefined;
    parser?: <T>(content: string) => T;
  }[];
  validation?: (row: any[]) => boolean;
}

export const defaultColumnType = 'string';
export const defaultValidation = (row: any[]): boolean => {
  return row.some(item => item.key === '审核状态' && item.value !== null);
};
