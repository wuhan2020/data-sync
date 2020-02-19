import { Controller } from 'egg';

export default class PatientDetailController extends Controller {

  public async getNearbyInformation() {
    const { latitude, longitude, distance } = this.ctx.queries;
    if (!(latitude?.length === 1) || !(longitude?.length === 1) || !(distance?.length === 1)) {
      this.ctx.body = {
        status: false,
        msg: 'Incorrect query',
      };
      return;
    }
    try {
      const lat = parseFloat(latitude[0]);
      const long = parseFloat(longitude[0]);
      const dis = parseFloat(distance[0]);
      let points = this.app.patientTrack.getPoints(lat, long, dis).filter(i => i.name !== '');
      points = points.sort((a, b) => a.distance - b.distance);

      const province = points.find(i => typeof i.province === 'string' && i.province !== '')?.province ?? '';
      const city = points.find(i => typeof i.city === 'string' && i.city !== '')?.city ?? '';
      const district = points.find(i => typeof i.district === 'string' && i.district !== '')?.district ?? '';

      let cityData: any[] = [];
      if (city !== '') {
        cityData = this.app.patientTrack.getCityPoints(city);
        cityData = cityData.sort((a, b) => a.rank - b.rank).slice(0, 5);
      }

      this.ctx.body = {
        status: true,
        msg: '',
        province,
        city,
        district,
        positions: points,
        special_positions: cityData.map(item => {
          return {
            name: item.name,
            number: item.infected_people_new,
            rank: item.rank,
          };
        }),
      };
    } catch {
      this.ctx.body = {
        status: false,
        msg: 'Incorrect query',
      };
      return;
    }
  }

  public async all() {
    this.ctx.body = this.app.patientTrack.getAllPoints();
  }

}
