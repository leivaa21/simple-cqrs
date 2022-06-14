import Query from './Query';
import IQueryHandler from './QueryHandler.interface';
import CQRS from '../core/CQRS';
function QueryHandler(options: QueryHandlerConfig) {
  const { Query, Dependencies } = options;
  const dependenciesNames = (Dependencies || []).map(
    (dependency) => dependency.name
  );
  return (constructor: Constructor<IQueryHandler<Query, unknown>>) => {
    CQRS.instance.queryBus.subscribe(Query, constructor, dependenciesNames);
  };
}
export default QueryHandler;
