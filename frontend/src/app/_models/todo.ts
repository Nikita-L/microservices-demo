export class Todo {
  id: number;
  content: string;
  constructor(
    id: number,
    text: string
  ) {
    this.id = id;
    this.content = text;
  }
}
