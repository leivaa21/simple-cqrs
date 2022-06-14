import { CommandHandler, ICommandHandler } from '../../';
import { createUserCommand } from './ExampleCommands';
import { UserRepository } from './ExampleDependencies';
import { User } from './ExampleEntities';

@CommandHandler({
  Command: createUserCommand,
  Dependencies: [UserRepository],
})
export class CreateUserCommandHandler
  implements ICommandHandler<createUserCommand>
{
  constructor(private readonly userRepository: UserRepository) {}
  handle(command: createUserCommand): void | Promise<void> {
    const { id, name } = command;
    this.userRepository.saveUser(new User(id, name));
  }
}
