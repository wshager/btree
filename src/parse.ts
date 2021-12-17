import { tokenize } from "./tokenize";
import { binaryOps, unaryOps } from "./terms";
import { AST } from "./ast";

export function parse(input: string) {
  const tokens = tokenize(input);
  const ast = { name: "MAIN", args: [] };
  return tokens.reduce(
    ({ ast, open }: { ast: AST; open: AST[] }, term: string) => {
      let ref = ast;
      if (open.length) {
        // if unary, close it
        if (
          unaryOps.includes(ast.name) ||
          (binaryOps.includes(ast.name) &&
            ast.args.length === 1 &&
            !binaryOps.includes(term))
        ) {
          ref = open.pop()!;
        }
      }
      if (binaryOps.includes(term)) {
        const node = { name: term, args: ast.args };
        ast.args = [node];
        open.push(ref);
        return { ast: node, open };
      }
      const node = { name: term, args: [] };
      ast.args.push(node);
      if (unaryOps.includes(term)) {
        open.push(ref);
        return { ast: node, open };
      }
      return { ast: ref, open };
    },
    { ast, open: [] }
  ).ast;
}
