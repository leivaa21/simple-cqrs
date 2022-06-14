import CQRS from './core/CQRS';
import QueryHandler from './queries/QueryHandler.decorator';
import CommandHandler from './commands/CommandHandler.decorator';
import IQueryHandler from './queries/QueryHandler.interface';
import ICommandHandler from './commands/CommandHandler.interface';
import Injectable from './injectables/Injectable.decorator';

export const QueryBus = CQRS.instance.queryBus;
export const CommandBus = CQRS.instance.commandBus;
export {
  QueryHandler,
  CommandHandler,
  IQueryHandler,
  ICommandHandler,
  Injectable,
};
