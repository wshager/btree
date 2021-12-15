// Node class
export class Node {
  public data: unknown;
  public left: Node;
  public right: Node;

  constructor(data: unknown, left?: Node, right?: Node) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}
