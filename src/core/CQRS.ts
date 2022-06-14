import Command from '../commands/Command';
import Query from '../queries/Query';
import BaseBus from './Bus';

export default class CQRS {
  private static _instance: CQRS | null = null;
  private _queryBus: BaseBus<Query, unknown>;
  private _commandBus: BaseBus<Command, void>;
  private constructor() {
    this._queryBus = new BaseBus<Query, unknown>('QueryBus');
    this._commandBus = new BaseBus<Command, void>('CommandBus');
  }
  public static get instance() {
    if (this._instance === null) this._instance = new CQRS();
    return this._instance;
  }
  get queryBus() {
    return this._queryBus;
  }
  get commandBus() {
    return this._commandBus;
  }

  public registerInjectable(
    Injectable: Constructor<unknown>,
    options?: InjectableOptions
  ) {
    this._queryBus.inject(Injectable, options);
    this._commandBus.inject(Injectable, options);
  }
}
