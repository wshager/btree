// Node class
export class Node {
  public data: unknown;
  public left: Node | null = null;
  public right: Node | null = null;

  constructor(data: unknown) {
    this.data = data;
  }
}
