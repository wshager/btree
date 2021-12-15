import { BTree } from "./btree";
import { Node } from "./node";

export function* depthFirst(node: Node | null): Generator<unknown> {
  if (node) {
    yield node.data;
    yield* depthFirst(node.left);
    yield* depthFirst(node.right);
  }
}

export function* breadthFirst(node: Node | null) {
  function* bf(queue: Node[]): Generator<unknown> {
    const newQueue: Node[] = [];
    for (let node of queue) {
      yield node.data;
      node.left && newQueue.push(node.left);
      node.right && newQueue.push(node.right);
    }
    if (newQueue.length) {
      yield* bf(newQueue);
    }
  }

  if (node) {
    yield* bf([node]);
  }
}

export function create(depth = 10) {
  let tree = new BTree();
  const count = Math.pow(2, depth);
  const insert = (cur: number, base: number) => {
    const n = cur / 2;
    const x = base - n;
    const y = base + n;
    if (Number.isInteger(x)) {
      tree.insert(x);
      insert(n, x);
    }
    if (Number.isInteger(y)) {
      tree.insert(y);
      insert(n, y);
    }
  };
  const cur = count / 2;
  tree.insert(cur);
  insert(cur, cur);
  return tree;
}
