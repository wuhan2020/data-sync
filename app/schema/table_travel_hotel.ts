import { TableConfig, getCellByName, getCellByType } from './table';

const tavelHotelTable: TableConfig = {
  guid: 'pdHRcXyKqJdqPyGJ',
  indexKey: 'travel_hotel',
  sheets: [ '工作表1' ],
  skipRows: 5,
  skipColumns: 1,
  nameRow: 3,
  typeRow: 4,
  defaultValueRow: 5,
  maxColumn: 'J',
  getFilePath: () => 'travel_hotel/data.json',
  feParser: async (data: any[]) => {
    return data.map((row, id) => {
      return {
        id,
        province: getCellByName(row, '省份').value,
        city: getCellByName(row, '市-区').value,
        contacts: getCellByType(row, 'contact').value,
        address: getCellByType(row, 'address').value,
        name: getCellByName(row, '联系人(酒店名称或者政府部门）').value,
        date: getCellByType(row, 'date').value,
        url: getCellByType(row, 'url').value,
        remark: getCellByName(row, '备注').value,
      };
    });
  },
};

export default tavelHotelTable;
