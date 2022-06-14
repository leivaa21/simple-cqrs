import CQRS from '../core/CQRS';

export default function Injectable(options?: InjectableOptions) {
  return (constructor: Constructor<unknown>) => {
    CQRS.instance.registerInjectable(constructor, options);
  };
}
