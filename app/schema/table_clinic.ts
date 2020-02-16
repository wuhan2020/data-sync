import { TableConfig, getCellByName, getCellByType } from './table';

const clinicTable: TableConfig = {
  guid: 'JgXjYCJJTRQxJ3GP',
  indexKey: 'clinic',
  sheets: [ '工作表1' ],
  skipRows: 4,
  skipColumns: 1,
  nameRow: 2,
  typeRow: 3,
  defaultValueRow: 4,
  maxColumn: 'H',
  getFilePath: () => 'clinic/data.json',
  feParser: async (data: any[]) => {
    return data.map((row, id) => {
      const typeValue = getCellByName(row, '类型').value;
      let type = '';
      switch (typeValue) {
        case 0:
          type = '新冠义诊';
          break;
        case 1:
          type = '心理咨询';
          break;
        case 2:
          type = '其他';
          break;
        case 3:
          type = '义诊&心理';
          break;
        default:
          break;
      }
      return {
        id,
        name: getCellByName(row, '义诊单位或个人').value,
        contacts: getCellByType(row, 'contact').value,
        date: getCellByType(row, 'date').value,
        url: getCellByType(row, 'url').value,
        remark: getCellByName(row, '备注').value,
        type,
      };
    });
  },
};

export default clinicTable;
