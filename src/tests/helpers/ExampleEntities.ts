export class User {
  constructor(public readonly id: string, public readonly name: string) {}
}

export class Note {
  constructor(public readonly title: string, public readonly content: string) {}
}
