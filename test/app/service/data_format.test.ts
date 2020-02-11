import * as assert from 'power-assert';
// import { Context } from 'egg';
// import { app } from 'egg-mock/bootstrap';
import DataFormatService from '../../../app/service/data_format';
import { isNumber } from 'util';

describe('test/app/service/data_format.test.js', () => {
  // let ctx: Context;

  before(async () => {
    // ctx = app.mockContext();
  });

  describe('int', () => {

    it('should parse right value', () => {
      const v = DataFormatService.intFormatter({
        value: '5',
      });
      assert(v.value === 5);
    });

    it('should return 0 if no value given', () => {
      const v = DataFormatService.intFormatter({
        value: '',
      });
      assert(v.value === 0);
    });

    it('should throw with wrong value', () => {
      assert.throws(
        () => {
          DataFormatService.intFormatter({
            value: 'd3',
          });
        },
        (err: Error) => {
          return err.message === 'Int value error, value=d3';
        },
      );
    });
  });

  describe('address', () => {

    it('should add coord', () => {
      const v = DataFormatService.addressFormatter({});
      const coord = v.coord;
      assert(Array.isArray(coord) && coord.length === 2 && coord.every(isNumber));
    });

  });

  describe('contact', () => {

    it('should throw if too many splitter', () => {
      const value = '张三:1239:12';
      assert.throws(
        () => {
          DataFormatService.contactFormatter({
            value,
          });
        },
        (err: Error) => {
          return err.message === `Contact value error, value=${value}`;
        },
      );
    });

    it('should parse correct data', () => {
      const valueStr = '张三:139|李四:021-32';
      const check = [
        {
          name: '张三',
          tel: '139',
        },
        {
          name: '李四',
          tel: '021-32',
        },
      ];
      const v = DataFormatService.contactFormatter({
        value: valueStr,
      });
      assert.deepEqual(v.value, check);
    });

    it('should parse with white space and chinese char', () => {
      const valueStr = '张三 ： 139 | 021-32 |';
      const check = [
        {
          name: '张三',
          tel: '139',
        },
        {
          name: '',
          tel: '021-32',
        },
      ];
      const v = DataFormatService.contactFormatter({
        value: valueStr,
      });
      assert.deepEqual(v.value, check);
    });

    it('a real case', () => {
      const valueStr = '张老师：18186011616｜周老师：13986572280｜胡老师：13451065900';
      const check = [
        {
          name: '张老师',
          tel: '18186011616',
        },
        {
          name: '周老师',
          tel: '13986572280',
        },
        {
          name: '胡老师',
          tel: '13451065900',
        },
      ];
      const v = DataFormatService.contactFormatter({
        value: valueStr,
      });
      assert.deepEqual(v.value, check);
    });

  });

  describe('supplies', () => {
    it('a real case', () => {
      const valueStr = '一次性医用口罩:100|N95 口罩';
      const check = [
        {
          specification: '一次性医用口罩',
          value: 100,
        },
        {
          specification: 'N95 口罩',
          value: 1,
        },
      ];
      const v = DataFormatService.suppliesFormatter({
        value: valueStr,
      });
      assert.deepEqual(v.value, check);
    });
  });

  describe('supply', () => {

    // TODO add later

  });

  describe('enum', () => {

    // TODO add later

  });

});
