import Handler from './Handler.interface';

// eslint-disable-next-line @typescript-eslint/ban-types
class BaseBus<TSubscription extends Object, TResponse> {
  private _subscriptions: Map<
    string,
    SubscriptableOptions<TSubscription, TResponse>
  >;
  private _injectables: Map<Constructor<unknown>, InjectableOptions>;
  private _busName: string;

  constructor(busName: string) {
    this._busName = busName;
    this._subscriptions = new Map<
      string,
      SubscriptableOptions<TSubscription, TResponse>
    >();
    this._injectables = new Map<Constructor<unknown>, InjectableOptions>();
  }
  subscribe<Subscription extends TSubscription, Response extends TResponse>(
    SubscriptionType: Constructor<Subscription>,
    Handler: Constructor<Handler<Subscription, Response>>,
    dependencies: string[]
  ) {
    const isAlreadySubscribed = this.isAlreadySubscribed(SubscriptionType.name);
    if (isAlreadySubscribed) {
      throw new Error(
        `${SubscriptionType.name} is already registered in ${this._busName}!`
      );
    }

    const options: SubscriptableOptions<Subscription, Response> = {
      Handler: Handler,
      Dependencies: dependencies,
    };

    this._subscriptions.set(SubscriptionType.name, options);
  }

  inject(
    Injectable: Constructor<unknown>,
    options: InjectableOptions = { Dependencies: [] }
  ) {
    const isAlreadyInjected = this._injectables.has(Injectable);
    if (isAlreadyInjected)
      throw new Error(
        `${Injectable.name} is already injected in ${this._busName}!`
      );
    this._injectables.set(Injectable, options);
  }

  dispatch<Subscription extends TSubscription, Response extends TResponse>(
    subscription: Subscription
  ): Promise<Response> | Response {
    const isAlreadySubscribed = this.isAlreadySubscribed(
      subscription.constructor.name
    );
    if (!isAlreadySubscribed)
      throw new Error(
        `${subscription.constructor.name} is not registered in ${this._busName}!`
      );

    const options = this.subscriptions.get(subscription.constructor.name);
    if (options === undefined)
      throw new Error(
        `${subscription.constructor.name} is not registered in ${this._busName}!`
      );

    const { Handler, Dependencies } = options;

    const dependencies: unknown[] = Dependencies.map((depName: string) => {
      const dependency = this.buildDependency(depName);
      return dependency;
    });

    const response = new Handler(...dependencies).handle(subscription);

    return response;
  }

  get subscriptions() {
    return this._subscriptions;
  }
  get injectables() {
    return this._injectables;
  }

  protected isAlreadySubscribed(Name: string): boolean {
    const isAlreadySubscribed: boolean = this._subscriptions.has(Name);
    return isAlreadySubscribed;
  }
  protected getInjectedDependency(
    injectableName: string
  ): [Constructor<unknown>, InjectableOptions] | null {
    for (const [Injectable, options] of this._injectables) {
      if (Injectable.name === injectableName) return [Injectable, options];
    }
    return null;
  }

  protected buildDependency(dependencyName: string): unknown {
    const dependency = this.getInjectedDependency(dependencyName);
    if (dependency === null)
      throw new Error(`Failed to find necesary dependency ${dependencyName}`);

    const [Dependency, options] = dependency;

    const args = options.Dependencies.map(
      (Dependency: Constructor<unknown>) => {
        return this.buildDependency(Dependency.name);
      }
    );

    return new Dependency(...args);
  }
}

export default BaseBus;
