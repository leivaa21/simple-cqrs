import { CommandBus, QueryBus } from '../';
import { CQRSModule } from '../core/CQRSModule';
import { CreateUserCommandHandler } from './helpers/ExampleCommandHandlers';
import { createUserCommand } from './helpers/ExampleCommands';
import {
  NoteRepository,
  TitleParser,
  Trimmer,
  UserRepository,
} from './helpers/ExampleDependencies';
import { Note, User } from './helpers/ExampleEntities';
import { getNoteByTitleQuery, getUserQuery } from './helpers/ExampleQueries';
import {
  GetNoteByTitleQueryHandler,
  GetUserQueryHandler,
} from './helpers/ExampleQueryHandlers';

describe('Testing the bus', () => {
  CQRSModule({
    QueryHandlers: [GetUserQueryHandler, GetNoteByTitleQueryHandler],
    CommandHandlers: [CreateUserCommandHandler],
    Injectables: [UserRepository, NoteRepository, TitleParser, Trimmer],
  });

  it('should work with GetUserQuery', async () => {
    const response = await QueryBus.dispatch<getUserQuery, User>(
      new getUserQuery('123')
    );

    expect(response.id).toBe('123');
    expect(response.name).toBe('Leiva');
  });

  it('should work with GetNoteByTitleQuery', async () => {
    const response = await QueryBus.dispatch<getNoteByTitleQuery, Note>(
      new getNoteByTitleQuery('   Title of the note   ')
    );
    expect(response.title).toBe('Title of the note');
  });

  it('should work with CreateUserCommand', async () => {
    expect(UserRepository.usersInMemo.length).toBe(2);
    await CommandBus.dispatch<createUserCommand, void>(
      new createUserCommand('1243', 'userTest')
    );
    expect(UserRepository.usersInMemo.length).toBe(3);
  });
});
