import { TableConfig, getCellByName } from './table';

const enterpriseDonationTable: TableConfig = {
  guid: 'd3KgGxvG68GrYX8j',
  indexKey: 'enterprise_donation',
  sheets: [ '国内企业捐款情况' ],
  skipRows: 4,
  skipColumns: 1,
  nameRow: 2,
  typeRow: 3,
  defaultValueRow: 4,
  maxColumn: 'K',
  getFilePath: () => 'enterprise_donation/data.json',
  feParser: async (data: any[]) => {
    return data.map((row, id) => {
      return {
        id,
        name: getCellByName(row, '企业名称').value,
        type: getCellByName(row, '企业类型').value,
        province: getCellByName(row, '企业所在省').value,
        city: getCellByName(row, '企业所在市').value,
        count: getCellByName(row, '捐款金额（万元）').value,
        date: getCellByName(row, '捐款时间').value,
        abstract: getCellByName(row, '摘要').value,
        url: getCellByName(row, '链接').value,
        remark: getCellByName(row, '备注').value,
      };
    });
  },
};

export default enterpriseDonationTable;
