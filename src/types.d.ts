/* eslint-disable @typescript-eslint/no-explicit-any */
type Constructor<T> = new (...args: any[]) => T;
type InjectableOptions = {
  Dependencies: Constructor<any>[];
};
type SubscriptableOptions<T, TResponse> = {
  Handler: Constructor<Handler<T, TResponse>>;
  Dependencies: string[];
};

type QueryHandlerConfig = {
  Query: Constructor<Query>;
  Dependencies?: Constructor<any>[];
};
type CommandHandlerConfig = {
  Command: Constructor<Command>;
  Dependencies?: Constructor<any>[];
};

type CQRSModuleOptions = {
  QueryHandlers: Constructor<IQueryHandler<Query, any>>[];
  CommandHandlers: Constructor<ICommandHandler<Command>>[];
  Injectables: Constructor<any>[];
};
