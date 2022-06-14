import { Injectable } from '../../';
import { Note, User } from './ExampleEntities';

@Injectable({
  Dependencies: [],
})
export class UserRepository {
  public static readonly usersInMemo = [
    new User('123', 'Leiva'),
    new User('1', 'Testing'),
  ];
  getUserByID(id: string) {
    return UserRepository.usersInMemo[
      UserRepository.usersInMemo.findIndex((user) => user.id === id)
    ];
  }
  saveUser(user: User) {
    UserRepository.usersInMemo.push(user);
  }
}

@Injectable({
  Dependencies: [],
})
export class NoteRepository {
  getNoteByTitle(title: string) {
    return new Note(title, 'this is content');
  }
}

@Injectable()
export class Trimmer {
  trim(msg: string) {
    return msg.trim();
  }
}

@Injectable({
  Dependencies: [Trimmer],
})
export class TitleParser {
  constructor(private readonly trimmer: Trimmer) {}
  parse(msg: string) {
    const parsedTitle = this.trimmer.trim(msg);
    return parsedTitle;
  }
}
