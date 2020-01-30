import { Service } from 'egg';
import { TableConfig, defaultValidation } from '../schema/table';

interface FormatFunc {
  (item: any): any;
}

export default class DataFormatService extends Service {

  public async format(data: any[], tableConfig: TableConfig): Promise<any> {
    data = data.filter(item => {
      return tableConfig.validation ? tableConfig.validation(item) : defaultValidation(item);
    });
    data = data.map(item => {
      if (!item.type) {
        return item;
      }
      let type = item.type;
      if (item.type.startsWith('enum')) {
        // enum{a,b}
        type = 'enum';
      } else if (item.type.startsWith('supply')) {
        // supply|specification
        type = 'supply';
      }
      const formatter = DataFormatService.fomatters.get(type);
      if (!formatter) {
        return item;
      }
      try {
        const i = formatter(item);
        return i ? i : item;
      } catch {
        return null;
      }
    });
    data = data.filter(data => data !== null);
    return data;
  }

  public static addressFormatter: FormatFunc = item => {
    item.coord = [0, 0];
    return item;
  }

  public static contactFormatter: FormatFunc = item => {
    const v: string = item.value;
    const contacts: {name: string; tel: string}[] = [];
    v.replace('：', ':').split('|').forEach(contact => {
      const s = contact.trim().split(':');
      if (s[0].trim() === '') return;
      if (s.length > 2) {
        throw new Error(`Contact value error, value=${item.value}`);
      }
      if (s.length === 2) {
        contacts.push({
          name: s[0].trim(),
          tel: s[1].trim(),
        });
      } else {
        contacts.push({
          name: '',
          tel: contact.trim(),
        });
      }
    });
    item.value = contacts;
    return item;
  }

  public static intFormatter: FormatFunc = item => {
    if (!item.value) {
      item.value = 0;
    }
    try {
      const value = parseInt(item.value);
      if (Number.isNaN(value)) {
        throw new Error();
      }
      item.value = value;
    } catch {
      throw new Error(`Int value error, value=${item.value}`);
    }
    return item;
  }

  public static floatFormatter: FormatFunc = item => {
    if (!item.value) {
      item.value = 0;
    }
    try {
      const value = parseFloat(item.value);
      if (Number.isNaN(value)) {
        throw new Error();
      }
      item.value = value;
    } catch {
      throw new Error(`Float value error, value=${item.value}`);
    }
    return item;
  }

  public static dateFormatter: FormatFunc = item => {
    if (item.value !== null) {
      item.value = new Date(item.value);
    }
    return item;
  }

  public static urlFormatter: FormatFunc = item => {
    if (item.value === null) {
      return item;
    }
    // TODO 检查 URL 连通性
    return item;
  }

  public static supplyFormatter: FormatFunc = item => {
    const ts = item.type.split('|');
    if (ts[0].trim() !== 'supply') {
      throw new Error(`Supply type error, type=${item.type}`);
    }
    item.type = 'supply';
    if (ts.lenght > 1) {
      item.specification = ts[1];
    }
    if (item.value === null) {
      return item;
    }
    const vs = item.value.split('|');
    try {
      item.value = parseInt(vs[0].trim());
    } catch {
      throw new Error(`Supply value error, value=${item.value}`);
    }
    if (vs.length > 1) {
      item.specification = vs[1].trim();
    }
    return item;
  }

  private static enumRegex = /^eunm{(.*)}/;
  public static enumFormatter: FormatFunc = item => {
    if (item.value === null) {
      return item;
    }
    const res = DataFormatService.enumRegex.exec(item.type);
    if (!res) {
      throw new Error(`Enum content error, type=${item.type}`);
    }
    if (!res[1].replace('，', ',').split(',').some(v => v.trim() === item.value)) {
      throw new Error(`Enum value error, value=${item.value}, type=${item.type}`);
    }
    item.type = 'enum';
    return item;
  }

  public static fomatters: Map<string, FormatFunc> = new Map([
    [
      'address', // 地址类信息，自动添加经纬度
      DataFormatService.addressFormatter,
    ], [
      'contact', // 联系人
      DataFormatService.contactFormatter,
    ], [
      'int', // 整型
      DataFormatService.intFormatter,
    ], [
      'float', // 浮点型
      DataFormatService.floatFormatter,
    ], [
      'date', // 时间型
      DataFormatService.dateFormatter,
    ], [
      'url', // 链接类型
      DataFormatService.urlFormatter,
    ], [
      'supply', // 物资类型
      DataFormatService.supplyFormatter,
    ], [
      'enum', // 枚举类型
      DataFormatService.enumFormatter,
    ],
  ]);

}
