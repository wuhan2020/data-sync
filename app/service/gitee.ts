import { Service } from 'egg';
import { GiteeClient } from '../component/gitee-client';
import * as moment from 'moment';

export default class GiteeService extends Service {

  public async updateRepo(path: string, str: string, token: string) {
    const { ctx, logger } = this;
    const config = ctx.app.config.gitee;

    const gitee = new GiteeClient(config.baseUrl, config.owner, config.repo, token);
    const newContent = Buffer.from(str).toString('base64');
    const message = `[${config.message}] ${moment().format()}`;

    try {
      const remoteContent = await gitee.getFileContent(path);
      if (!remoteContent) {
        logger.info(`Goona create gitee file ${path}`);
        const createResult = await gitee.createFile(path, newContent, message);
        if (createResult) logger.info(`Create gitee file ${path} succeed`);
      } else if (remoteContent.content === newContent) {
        logger.info(`Do not need update gitee file ${path}`);
      } else {
        logger.info(`Goona update gitee file ${path}`);
        const updateResult = await gitee.updateFile(path, newContent, remoteContent.sha, message);
        if (updateResult) logger.info(`Update gitee file ${path} succeed`);
      }
    } catch (err) {
      logger.error(err);
    }
  }

}
