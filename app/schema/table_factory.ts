import { TableConfig, getCellByName, getCellByType, getAllCellsByType } from './table';

const factoryTable: TableConfig = {
  guid: 'pchvJ6ddyRHHdXtv',
  indexKey: 'factory',
  sheets: [ '厂家表' ],
  skipRows: 3,
  skipColumns: 1,
  nameRow: 1,
  typeRow: 2,
  defaultValueRow: 3,
  maxColumn: 'T',
  getFilePath: () => 'factory/data.json',
  feParser: async (data: any[]) => {
    return data.map((row, id) => {
      const supplies = getAllCellsByType(row, 'supplies').filter(item => item.value.length > 0).map(item => {
        return item.value.map(v => {
          return {
            key: item.key,
            specification: v.specification,
            value: v.value,
          };
        });
      });
      const supplyArray: any[] = [];
      supplies.forEach(s => {
        supplyArray.push(...s);
      });
      return {
        id,
        province: getCellByName(row, '省').value,
        city: getCellByName(row, '市').value,
        name: getCellByName(row, '厂商名称').value,
        supplies: supplyArray,
        qualification: getCellByName(row, '资质证明').value,
        address: getCellByName(row, '厂商地址').value,
        contacts: getCellByType(row, 'contact').value,
        date: getCellByType(row, 'date').value,
        url: getCellByType(row, 'url').value,
        remark: getCellByName(row, '备注').value,
      };
    });
  },
};

export default factoryTable;
