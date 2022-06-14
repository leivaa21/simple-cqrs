export default interface Handler<T, TRes> {
  handle(object: T): Promise<TRes> | TRes;
}
