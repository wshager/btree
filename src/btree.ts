import { Node } from "./node";

export class BTree {
  public root: Node;

  insert(data) {
    const node = new Node(data);
    this.appendOrInsert(this, node, "root");
    return this;
  }
  insertNode(node, newNode) {
    if (newNode.data < node.data) {
      this.appendOrInsert(node, newNode, "left");
    } else {
      this.appendOrInsert(node, newNode, "right");
    }
  }

  private appendOrInsert(
    node: BTree | Node,
    newNode: Node,
    position: "left" | "right" | "root"
  ) {
    if (!node[position]) {
      node[position] = newNode;
    } else {
      this.insertNode(node[position], newNode);
    }
  }
}
