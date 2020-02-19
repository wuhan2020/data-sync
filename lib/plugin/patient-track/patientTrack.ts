import { Application } from 'egg';
import { pointsDistance } from './utils';
import * as request from 'requestretry';

interface Point {
  name: string;
  province: string;
  city: string;
  district: string;
  infected_people_total: number;
  infected_people_new: number;
  rank: number;
  distance: number;
  risk: 'high' | 'normal' | 'extreme';
  latitude: number;
  longitude: number;
}

interface RawData {
  confirmDate: string;
  confirmHospital: {
    addr: string;
    coord: {
      province: string;
      city: string;
      district: string;
      long: string;
      lat: string;
    };
  };
}

const cdnBaseUrl = 'https://wh.opensource-service.cn/data/';

export default class PatientTrack {

  private app: Application;
  private points: Map<string, Point>;

  constructor(app: Application) {
    this.app = app;
    this.points = new Map<string, Point>();
    this.initData();
  }

  private async initData() {
    const index = await this.get(cdnBaseUrl + 'index.json');
    if (!index) {
      return;
    }
    const detailList: string[] = JSON.parse(index).patient_detail;
    const points: any[] = [];
    await Promise.all(detailList.map(async path => {
      const d = await this.get(cdnBaseUrl + 'fe/' + path);
      if (!d) return;
      const data = JSON.parse(d);
      if (!Array.isArray(data)) return;
      points.push(...data);
    }));
    this.setData(points);
  }

  public clearData() {
    this.points.clear();
  }

  public setData(data: RawData[]) {
    this.clearData();
    this.addData(data);
  }

  public addData(data: RawData[]) {
    const now = new Date().getTime();
    data.forEach((line: RawData) => {
      if (!this.points.has(line.confirmHospital.addr)) {
        this.points.set(line.confirmHospital.addr, {
          name: line.confirmHospital.addr,
          province: line.confirmHospital.coord?.province ?? '',
          city: line.confirmHospital.coord?.city ?? '',
          district: line.confirmHospital.coord?.district ?? '',
          infected_people_total: 0,
          infected_people_new: 0,
          distance: 0,
          rank: 0,
          risk: 'normal',
          latitude: parseFloat(line.confirmHospital.coord?.lat ?? 0),
          longitude: parseFloat(line.confirmHospital.coord?.long ?? 0),
        });
      }
      const item = this.points.get(line.confirmHospital.addr);
      if (!item) return;
      item.infected_people_total++;
      if (line.confirmDate) {
        if (now - new Date(line.confirmDate).getTime() >= 7 * 24 * 60 * 60 * 1000) {
          item.infected_people_new++;
        }
      }
    });
    this.updateRank();
    this.app.logger.info('Set points done, size=', this.points.size);
  }

  private updateRank() {
    const arr = Array.from(this.points.values());
    const set = new Set<string>();
    arr.forEach(i => {
      if (set.has(i.city)) return;
      set.add(i.city);
      const a = arr.filter(item => item.city === i.city);
      a.sort((a, b) => b.infected_people_total - a.infected_people_total);
      a.forEach((item, index) => {
        item.rank = index + 1;
      });
    });
  }

  public getPoints(lat: number, long: number, dis: number): Point[] {
    this.app.logger.info(`Goona get data for lat=${lat}, long=${long}, dis=${dis}`);
    return Array.from(this.points.values()).filter(p => {
      p.distance = pointsDistance(p.latitude, p.longitude, lat, long);
      return p.distance < dis;
    });
  }

  public getCityPoints(city: string): Point[] {
    this.app.logger.info(`Gonna get data for city=${city}`);
    return Array.from(this.points.values()).filter(p => p.city === city);
  }

  public getAllPoints(): Point[] {
    return Array.from(this.points.values());
  }

  private async get(url: string): Promise<any> {
    return new Promise(resolve => {
      const options = {
        method: 'GET',
        url,
      };
      request(options, (err: any, _: any, body: string) => {
        if (err) {
          this.app.logger.error(err);
          resolve();
          return;
        }
        resolve(body);
      });
    });
  }
}
