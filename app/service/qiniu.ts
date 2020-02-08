import { Service } from 'egg';
import * as qiniu from 'qiniu';

export default class QiniuService extends Service {

  public async uploadFile(path: string, content: string) {
    const { logger } = this;
    const config = this.app.config.qiniu;
    if (!config.enable) {
      return;
    }

    try {
      const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);

      const options = {
        scope: `${config.bucket}:${path}`,
      };
      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(mac);

      const formUploader = new qiniu.form_up.FormUploader(config);
      const putExtra = new qiniu.form_up.PutExtra();

      formUploader.put(uploadToken, path, content, putExtra, (respErr, respBody, respInfo) => {
        if (respErr) {
          logger.error(respErr);
        }
        if (respInfo.statusCode === 200) {
          logger.info(respBody);
        } else {
          logger.info(respInfo.statusCode, respBody);
        }
      });
    } catch (e) {
      logger.error(e);
    }
  }
}
