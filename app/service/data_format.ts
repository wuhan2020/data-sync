import { Service } from 'egg';
import { TableConfig, defaultValidation } from '../schema/table';

export default class DataFormatService extends Service {

  public async format(data: any[], tableConfig: TableConfig): Promise<any> {
    const newData = data.filter(item => {
      return tableConfig.validation ? tableConfig.validation(item) : defaultValidation(item);
    });
    return newData;
  }

}
