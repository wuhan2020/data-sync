import { TableConfig } from './table';

const clinicTable: TableConfig = {
  guid: 'JgXjYCJJTRQxJ3GP',
  sheets: [ '工作表1' ],
  skipRows: 4,
  skipColumns: 1,
  nameRow: 2,
  typeRow: 3,
  defaultValueRow: 4,
  maxColumn: 'G',
  getFilePath: () => '义诊/data.json',
};

export default clinicTable;
