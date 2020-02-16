import { app } from 'egg-mock/bootstrap';
import * as assert from 'power-assert';

describe('test/app/plugin/egg-datacache.test.ts', () => {

  before(async () => { //
  });

  it('datacache plugin', async () => {
    const key = 'test';
    app.datacache.setData(key, 123);
    const data = app.datacache.getDataByKey(key);
    assert(data === 123);
  });
});
