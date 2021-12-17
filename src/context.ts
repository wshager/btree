import { AST } from "./ast";
import { Node } from "./node";

export interface Context {
  node: Node | null;
  cookie: number;
  ast: AST;
  visitor: (node: Node) => void;
  result?: unknown;
  callCount: number;
  stackSize: number;
}
