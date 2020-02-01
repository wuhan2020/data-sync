import * as request from 'request-promise';
import { Service } from 'egg';

export default class Utility extends Service {

  private URL_PATTERN = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

  /**
   * check the connectivity of a given URL, if http prefix is not assigned, http:// would be append as prefix of the URL
   * @param url given website address
   * @return {Promise<any>}
   */
  public async checkURLConnectivity(url): Promise<any> {
    return new Promise((resolve, reject) => {
      const logger = this.ctx.logger;
      if (!url.match(this.URL_PATTERN)) {
        logger.error('invalid url address, url=' + url + ' appending http://');
        url = 'http://' + url;
      }
      const option = {
        uri: url,
        resolveWithFullResponse: true,
      };
      request(option).then(res => {
        if (res.statusCode === 200) {
          resolve({
            result: 'yes',
            statusCode: res.statusCode,
            url,
          });
        } else {
          resolve({
            result: 'no',
            statusCode: res.statusCode,
            url,
          });
        }

      }).catch(err => {
        if (err) {
          logger.error(err.toString());
          reject(err);
        }
      });

    });

  }
}
