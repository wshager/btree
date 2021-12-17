import { Node } from "./node";

export class BTree {
  public root: Node | null = null;

  insert(data: unknown) {
    const node = new Node(data);
    this.appendOrInsert(this, node, "root");
    return this;
  }
  insertNode(node: Node, newNode: Node) {
    if ((newNode.data as number) < (node.data as number)) {
      this.appendOrInsert(node, newNode, "left");
    } else {
      this.appendOrInsert(node, newNode, "right");
    }
  }

  private appendOrInsert(
    node: any,
    newNode: Node,
    position: "left" | "right" | "root"
  ) {
    if (!node[position]) {
      node[position] = newNode;
    } else {
      this.insertNode(node[position], newNode);
      newNode.parent = node[position];
    }
  }
}
