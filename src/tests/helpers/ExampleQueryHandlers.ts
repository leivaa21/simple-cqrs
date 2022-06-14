import { QueryHandler, IQueryHandler } from '../../';
import {
  NoteRepository,
  TitleParser,
  UserRepository,
} from './ExampleDependencies';
import { User, Note } from './ExampleEntities';
import { getUserQuery, getNoteByTitleQuery } from './ExampleQueries';

@QueryHandler({
  Query: getUserQuery,
  Dependencies: [UserRepository],
})
export class GetUserQueryHandler implements IQueryHandler<getUserQuery, User> {
  constructor(private readonly userRepository: UserRepository) {}
  handle(query: getUserQuery): User | Promise<User> {
    const { id } = query;
    return this.userRepository.getUserByID(id);
  }
}

@QueryHandler({
  Query: getNoteByTitleQuery,
  Dependencies: [NoteRepository, TitleParser],
})
export class GetNoteByTitleQueryHandler
  implements IQueryHandler<getNoteByTitleQuery, Note>
{
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly titleParser: TitleParser
  ) {}
  handle(query: getNoteByTitleQuery): Note | Promise<Note> {
    const { title } = query;
    const parsedTitle = this.titleParser.parse(title);
    const note = this.noteRepository.getNoteByTitle(parsedTitle);
    return note;
  }
}
