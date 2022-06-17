<div align="center">
  <img src="https://i.imgur.com/kNceXro.png" alt="SimpleCQRS's logo" width="200"/>
</div>
<div align="center">
  <p>A simple lightweight CQRS library inspired in the nestjs/cqrs module</p>
</div>
<div align="center">
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-success.svg?style=for-the-badge"
      alt="API stability" />
  </a>
  <a href="https://npmjs.org/package/@leivaa/simple-cqrs">
    <img src="https://img.shields.io/npm/v/@leivaa/simple-cqrs.svg?style=for-the-badge"
      alt="NPM version" />
  </a>
  <a href="https://npmjs.org/package/@leivaa/simple-cqrs">
    <img src="https://img.shields.io/npm/dt/@leivaa/simple-cqrs.svg?style=for-the-badge"
      alt="Downloads" />
  </a>
</div>

<div align="center">
  <a href="https://github.com/leivaa21">
    <img src="https://img.shields.io/badge/built%20by-< developers />-informational?style=flat"
      alt="Built by developers" />
  </a>
  <a href="https://github.com/leivaa21/simple-cqrs/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license%20-MIT-success?style=flat"
      alt="MIT Licensed project" />
  </a>
  <a href="https://npmjs.org/package/@leivaa/simple-cqrs">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white"
      alt="Using typescript" />
  </a>
</div>

---

<details open="open">
<summary>Table of contents</summary>

- [About](#about)
  - [Bases](#Bases)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [How to use](#how-to-use)
    - [Queries](#queries)
    - [Commands](#commands)
    - [Injectables](#injectables)
    - [Global CQRS Module](#cqrs-module)
- [License](#license)

</details>

---

## About

`simple-cqrs` is a package that aims to bring CQRS to its simplest.
Its written using Typescript, so it already brings all the `d.types`.

The package aims to give a smooth programming experience, and its inspired in frameworks like angular and nestjs.

- ### Bases
  **C**ommand **Q**uery **R**esponsability **S**egregation is a design pattern that aims to keep the infrastructure handler and the service handler decoupled.

## Getting Started

All the code for this example is public on the [leivaa21/simple-cqrs-express-example](https://github.com/leivaa21/simple-cqrs-express-example) repository.

- ### Prerequisites

  - Made using:

    - `Node v18.3.0`
    - `NPM v8.5.5`
    - `Typescript v4.7.3`

    so these are the **recomended** versions.

  - `tsconfig.json` has to have the property

    ```json
      "experimentalDecorators": true,
    ```

    for being able to use decorators (needed in this package)

  - for installing this package in your npm project, use:</br>
    `npm install @leivaa/simple-cqrs`

- ### How to use

  - ### **Queries**

    #### **_Query and Handler structure_**

    > Keep in mind that Queries are meant to return information from our application BUT are not meant to modify the status quo of our application itself.

    getUser.query.ts

    ```typescript
    export default class GetUserQuery {
      constructor(public readonly id: string) {}
    }
    ```

    getUser.handler.ts

    ```typescript
    const config: QueryHandlerConfig = {
      Query: GetUserQuery,
      Dependencies: [InMemoryUserRepository],
    };

    @QueryHandler(config)
    export default class GetUserQueryHandler
      implements IQueryHandler<GetUserQuery, GetUserResponse>
    {
      constructor(private readonly repository: UserRepository) {}
      async handle(query: GetUserQuery): Promise<GetUserResponse> {
        //Your code
      }
    }
    ```

    > - Its _recomendend_ to use abstractions in the constructor, but "Dependencies" in the handler config should always have a implementation class!
    > - The implementations given in "Dependencies" should always be marked as "Injectable" (More info down below!)

      </br>

    #### **Using the query bus**

    Here you have an example of controller following the same example as the one given above.
    This example uses Express, but the framework doesnt matter, and it would work in vanilla node too ie.

    getUser.controller.ts

    ```typescript
    export default async function getUserController(
      req: Request,
      res: Response
    ) {
      //Some code here
      const QueryResponse = await QueryBus.dispatch<
        GetUserQuery,
        GetUserResponse
      >(new GetUserQuery(id));
      //Some code more
    }
    ```

  - ### **Commands**

    #### **_Command and Handler structure_**

    This is pretty much the same as in the query side, only changing Query for Command!

    > Keep in mind that Commands are meant to modify the status quo of our application BUT are not meant to return nothing.

    createUser.command.ts

    ```typescript
    export default class CreateUserCommand {
      constructor(public readonly id: string, public readonly name: string) {}
    }
    ```

    createUser.handler.ts

    ```typescript
    const options: CommandHandlerConfig = {
      Command: CreateUserCommand,
      Dependencies: [InMemoryUserRepository, UserFactory],
    };

    @CommandHandler(options)
    export default class CreateUserCommandHandler
      implements ICommandHandler<CreateUserCommand>
    {
      constructor(
        private readonly repository: UserRepository,
        private readonly factory: UserFactory
      ) {}
      async handle(command: CreateUserCommand): Promise<void> {
        //Our code here
      }
    }
    ```

    > Its **important** to keep in mind that "Dependencies" in the handler config should always keep the same order as in the constructor.

    </br>

    #### **Using the query bus**

    getUser.controller.ts

    ```typescript
    export default async function createUserController(
      req: Request,
      res: Response
    ) {
      //Some code here
      await CommandBus.dispatch<CreateUserCommand, void>(
        new CreateUserCommand(id, name)
      );
      //Some more code here
    }
    ```

    > CommandBus should always use the return type void as handlers are meant to not return nothing.

  - ### **Injectables**

    Injecting dependencies brings a lot of decoupling to our apps, as long as we only depends on abstractions and not implementations of our services.

    Keeping with the same example, this would be how we create an Injectable:

    UserFactory.ts

    ```typescript
    const config: InjectableConfig = {
      Dependencies: [],
    };

    @Injectable(config)
    export default class UserFactory {
      create(id: string, name: string): User {
        //your code
      }
    }
    ```

    > Dependencies in the config works just like dependencies in hanlders. So its possible to inject dependencies to injectable objects.

  - ### **CQRS Module**

    > Its important to know that the cqrs module has to be initialized in some way, and all the Handlers & Injectables have to get loaded. So its important to set up the CQRS Module in a space of code that will be loaded at the same time as our application start.

    cqrs.module.ts

    ```typescript
    const config: CQRSModuleConfig = {
      QueryHandlers: [...QueryHandlers],
      CommandHandlers: [...CommandHandlers],
      Injectables: [InMemoryUserRepository, UserFactory],
    };

    CQRSModule(config);
    ```

    Using the spread operator its a way of keeping the module config cleaner, but this will make us made a index.ts with all the handlers loaded into an array, like this:

    application/index.ts

    ```typescript
    export const CommandHandlers = [CreateUserCommandHandler];
    export const QueryHandlers = [GetUserQueryHandler, GetAllUsersQueryHandler];
    ```

    > Some times injectables are loaded by other handlers and it wont fail even if you dont load them into the CQRS Module, **BUT** it is a good practice to load them just in case it doesnt load all the injectables.

## License

This project is under a MIT license, so its open source and open for contributions :).
[More info about the license here](https://github.com/leivaa21/simple-cqrs/blob/master/LICENSE)
