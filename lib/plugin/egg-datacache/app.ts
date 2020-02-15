
import datacache from './extend/datacache';

module.exports = app => {
  datacache(app);
  // const str = app.datacache.getDatabyKey('test');
  // console.log('calling from app.ts in plugin -->' + str);
};

