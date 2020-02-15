export class Cache {

  private _container;

  constructor() {
    this._container = new Map();
  }

  public getDataByKey(k) {
    return this._container.get(k);
  }

  public setData(k, d) {
    this._container.set(k, d);
  }

  public getContainer() {
    return this._container;
  }

  public hasKey(k) {
    return this._container.has(k);
  }

  public getKeys() {
    return this._container.keys();
  }

}
