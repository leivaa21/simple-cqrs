import Handler from '../core/Handler.interface';
import Query from './Query';
type IQueryHandler<T extends Query, TResponse> = Handler<T, TResponse>;
export default IQueryHandler;
