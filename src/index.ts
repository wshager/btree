import { BTree } from "./btree";

export const depthFirst = (node) => {
  if (node) {
    console.log(node.data);
    depthFirst(node.left);
    depthFirst(node.right);
  }
};

export function create(depth = 10) {
  let tree = new BTree();
  for (let i = 1; i < Math.pow(2, depth); i++) {
    tree = tree.insert(i);
  }
  return tree;
}
