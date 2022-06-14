import Command from './Command';
import ICommandHandler from './CommandHandler.interface';
import CQRS from '../core/CQRS';
function CommandHandler(options: CommandHandlerConfig) {
  const { Command, Dependencies } = options;
  const dependenciesNames = (Dependencies || []).map(
    (dependency) => dependency.name
  );
  return (constructor: Constructor<ICommandHandler<Command>>) => {
    CQRS.instance.commandBus.subscribe(Command, constructor, dependenciesNames);
  };
}
export default CommandHandler;
