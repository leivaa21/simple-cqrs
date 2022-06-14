import Handler from '../core/Handler.interface';
import Command from './Command';
type ICommandHandler<T extends Command> = Handler<T, void>;
export default ICommandHandler;
