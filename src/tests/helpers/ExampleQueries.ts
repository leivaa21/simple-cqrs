export class getUserQuery {
  constructor(public readonly id: string) {}
}

export class getNoteByTitleQuery {
  constructor(public readonly title: string) {}
}
