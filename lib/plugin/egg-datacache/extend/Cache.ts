export class Cache {

  private _container: Map<string, any>;

  constructor() {
    this._container = new Map();
  }

  public getDataByKey(k: string): any {
    return this._container.get(k);
  }

  public setData(k: string, d: any) {
    this._container.set(k, d);
  }

  public getContainer() {
    return this._container;
  }

  public hasKey(k: string) {
    return this._container.has(k);
  }

  public getKeys() {
    return this._container.keys();
  }

}
