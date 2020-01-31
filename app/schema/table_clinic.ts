import { TableConfig, getCellByName, getCellByType } from './table';

const clinicTable: TableConfig = {
  guid: 'JgXjYCJJTRQxJ3GP',
  sheets: [ '工作表1' ],
  skipRows: 4,
  skipColumns: 1,
  nameRow: 2,
  typeRow: 3,
  defaultValueRow: 4,
  maxColumn: 'G',
  getFilePath: () => 'clinic/data.json',
  feParser: (data: any[]) => {
    return data.map(row => {
      return {
        name: getCellByName(row, '义诊单位或个人').value,
        contacts: getCellByType(row, 'contact').value,
        date: getCellByType(row, 'date').value,
        url: getCellByType(row, 'url').value,
        remark: getCellByName(row, '备注').value,
      };
    });
  },
};

export default clinicTable;
