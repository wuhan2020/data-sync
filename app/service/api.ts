import { Service } from 'egg';
import * as request from 'requestretry';
import { ApiConfig } from '../external_api/api';

export default class ApiService extends Service {

  public async update() {
    const { logger } = this;
    const config = this.app.config.api;

    const updateFunc = async (path: string, data: any) => {
      logger.info(`Start to update ${path}`);
      await this.ctx.service.github.updateRepo(path, data);
      await this.ctx.service.gitee.updateRepo(path, data);
      await this.ctx.service.qiniu.uploadFile(path, data);
    };

    config.apis.forEach((apis: ApiConfig[]) => {
      for (const apiConfig of apis) {
        const options = {
          method: 'GET',
          url: apiConfig.url,
        };
        request(options, (err: any, _: any, body: string) => {
          if (err) {
            logger.error(err);
            return;
          }
          updateFunc(`data/${apiConfig.getFilePath(apiConfig.url)}`, body);
        });
      }
    });
  }
}
