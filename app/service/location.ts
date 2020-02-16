import { Service } from 'egg';
import AddressParser = require('parse-address-cn');
import leven from 'leven';

export default class LocationService extends Service {

  private STRING_SIMILARITY_LEVEL = 0.75;
  private MAXIMUM_ADDR_LENGTH = 84;
  private debug = false;

  /**
   * convert address to coordinate via Gaode geocode api
   * @param address readable address
   * @return {
   *            code: 200(OK)/500(error)
   *            count: number of converted coordinates
   *            list: an array of place_info
   *            msg: error message, only valid when code is 500
   *            }
   */
  public async retrieveCoordinateViaGD(address) {
    const { config, logger } = this.ctx.app;
    const gaode_geoservice_url = 'https://restapi.amap.com/v3/geocode/geo?address=' + address + '&output=json&key=' + config.gaode.api_key;

    const response = await this.ctx.curl(gaode_geoservice_url, {
      // parse JSON response
      dataType: 'json',
      // timeout of 3s
      timeout: 3000,
    });

    // process response
    if (typeof (response.data) !== 'undefined') {

      const raw_data = response.data;
      if (raw_data.status === '1') {
        try {
          const code = 200;
          const count = raw_data.count;
          const list = new Array<PlaceInfo>();// contains matched results
          for (let i = 0; i < raw_data.count; i++) {
            const geo = raw_data.geocodes[i];
            const _province = geo.province;
            const _city = geo.city;
            const _district = geo.district;
            const location = geo.location;
            const raw_str = location.split(',');
            let lon = 0,
              lat = 0;
            if (raw_str.length >= 2) {
              lon = raw_str[0];
              lat = raw_str[1];
            }

            const place_info = {
              addr: address,
              province: _province,
              city: _city,
              district: _district,
              longitude: lon,
              latitude: lat,
            };

            list.push(place_info);
            const addr_obj = AddressParser.parseAddress(address);
            if (typeof (addr_obj.name) !== 'undefined' && addr_obj.name !== '' && !this.app.datacache.hasKey(addr_obj.name)) {
              // cache data
              // note: only the first data in the list would be cached
              if (this.debug) { console.log('addr_obj=' + JSON.stringify(addr_obj)); }
              this.app.datacache.setData(addr_obj.name, place_info);
            }
          }
          const result = {
            code,
            count,
            list,
          };
          return result;

        } catch (e) {
          logger.error('encountered error while parsing response data, msg:' + e.message);
          return null;
        }
      } else {
        logger.error(response);
        const result = {
          code: 500,
          msg: 'encountered error while requesting geocoding service from Gaode Map Engine, msg:' + response.toString(),
        };
        return result;
      }
    }

  }

  /**
   * convert address to coordinate via baidu geocoding api
   * @param address
   * @param use_baidu_coord use baidu lat_lon coordinate(bd09ll) or use normal coordinate(gcj02ll). true by default
   * @return
   * {
   *            code: 200(OK)/500(error)
   *            count: number of converted coordinates, only 1 result is returned via baidu api
   *            place_info: all information about requested place
   *            msg: error message, only valid when code is 500
   *            }
   */
  public async retrieveCoordinateViaBD(address, use_baidu_coord = true) {
    const { config, logger } = this.ctx.app;
    if (address.length >= this.MAXIMUM_ADDR_LENGTH) {
      logger.error('address ${address} is too long for baidu api. omit request...');
    } else {
      let coord_type = 'bd09ll';
      if (!use_baidu_coord) {
        coord_type = 'gcj02ll';
      }

      const baidu_geoservice_url = 'http://api.map.baidu.com/geocoding/v3/?address=' + address + '&ret_coordtype=' + coord_type + '&output=json&ak=' + config.baidu.api_key;

      const response = await this.ctx.curl(baidu_geoservice_url, {
        // parse JSON response
        dataType: 'json',
        // timeout of 3s
        timeout: 3000,
      });

      // process response
      if (typeof (response.data) !== 'undefined') {
        const raw_data = response.data;
        if (raw_data.status === 0) {
          try {
            const code = 200;
            const addr_parsed = AddressParser.parseAddress(address);
            const _province = addr_parsed.province;
            const _city = addr_parsed.city;
            const _district = addr_parsed.area;
            const _lat = raw_data.result.location.lat;
            const _lng = raw_data.result.location.lng;
            const place_info = {
              addr: address,
              province: _province,
              city: _city,
              district: _district,
              longitude: _lng,
              latitude: _lat,
            };
            if (typeof (addr_parsed.name) !== 'undefined' && addr_parsed.name !== '' && !this.app.datacache.hasKey(addr_parsed.name)) {
              // cache data
              if (this.debug) { console.log('addr_obj=' + JSON.stringify(addr_parsed)); }
              this.app.datacache.setData(addr_parsed.name, place_info);
            }

            const result = {
              code,
              place_info,
            };

            return result;

          } catch (e) {
            logger.error('encountered error while parsing response data, msg:' + e.toString());
            return null;
          }
        } else {

          const result = {
            code: 500,
            msg: 'encountered error while requesting geocoding service from Gaode Map Engine, msg:' + response.toString(),
          };
          return result;
        }
      }
    }

  }

  /**
   * get location object from cache
   * @param addr readable address
   * @return {PlaceInfo} contains address, province, city, district, latitude, longitude
   */
  public getLocationFromCache(addr) {
    if (this.app.datacache.hasKey(addr)) {
      return this.app.datacache.getDataByKey(addr);
    }

    // traverse key list of data cache to find similar addresses
    // use 'leven' to compare address strings.
    // similarity level larger than STRING_SIMILARITY_LEVEL should be considered as similar addresses.
    // use 'parse-address-cn' to parse plain address string
    const addr_obj = AddressParser.parseAddress(addr);
    const addr_detail = addr_obj.name;// omit province and city, only compare detail address
    const keys = this.app.datacache.getKeys();
    for (const k of keys) {
      if (this.compareAddressStrings(addr_detail, k)) {
        return this.app.datacache.getDataByKey(k);
      }
      continue;

    }

    return null;

  }

  private compareAddressStrings(str1, str2) {
    const len = str1.length > str2.length ? str1.length : str2.length;
    const match_index = (len - leven(str1, str2)) * 1.0;
    const ratio = match_index / len;
    if (this.debug) console.log('str1=' + str1 + '\nstr2=' + str2 + '\nratio=' + ratio + '\nmatch_index=' + match_index);
    if (ratio >= this.STRING_SIMILARITY_LEVEL) {
      return true;
    }
    return false;

  }

}

type PlaceInfo = {
  addr: string;
  province: string;
  city: string;
  district: string;
  longitude: number;
  latitude: number;
};
