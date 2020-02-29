import { TableConfig, getCellByName, getCellByType } from './table';

const logisticalTable: TableConfig = {
  guid: 'RTHXp3ghtKXY3GcC',
  indexKey: 'logistical',
  sheets: [ '国内物流入武汉' ],
  skipRows: 4,
  skipColumns: 1,
  nameRow: 2,
  typeRow: 3,
  defaultValueRow: 4,
  maxColumn: 'S',
  getFilePath: () => 'logistical/data.json',
  feParser: async (data: any[]) => {
    return data.map((row, id) => {
      return {
        id,
        name: getCellByName(row, '物流名称').value,
        from: getCellByName(row, '出发地').value,
        dest: getCellByName(row, '目的地').value,
        contacts: getCellByType(row, 'contact').value,
        date: getCellByType(row, 'date').value,
        allowPersonal: getCellByName(row, '是否接受个人捐赠').value,
        url: getCellByName(row, '发布链接').value,
        remark: getCellByName(row, '备注').value,
        area: getCellByName(row, '物流区域').value,
        telRemark: getCellByName(row, '电话备注').value,
        website: getCellByName(row, '官网网址').value,
        orderUrl: getCellByName(row, '下单地址').value,
        customService: getCellByName(row, '在线客服网址').value,
        noticeTitle: getCellByName(row, '公告文本标题').value,
        noticeContent: getCellByName(row, '公告文本').value,
        greenPath: getCellByName(row, '绿色通道').value,
      };
    });
  },
};

export default logisticalTable;
