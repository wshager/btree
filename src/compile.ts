import { AST } from "./ast";
import { Context } from "./context";
import { Node } from "./node";

function exec(ctx: Context, ast: AST): Context {
  ctx.callCount++;
  if (ctx.callCount > ctx.stackSize) {
    throw new RangeError(`Maximum call stack size exceeded`);
  }
  const func = ops[ast.name.toLowerCase()];
  const stack = ast.args.map((arg) => exec(ctx, arg));
  return func(ctx, ...stack);
}

const or = (_ctx: Context, a: unknown, b: unknown) => a || b;
const and = (_ctx: Context, a: unknown, b: unknown) => a && b;
const cookie = (ctx: Context, node: Node | null) =>
  node?.data === ctx.cookie ? ctx.cookie : null;
const here = (ctx: Context): Node | null => ctx.node;
const back = (ctx: Context): Node | null => ctx.node?.parent || null;
const left = (ctx: Context): Node | null => ctx.node?.left || null;
const right = (ctx: Context): Node | null => ctx.node?.right || null;
const nothing = () => null;
const go = (ctx: Context, node: Node | null): any => {
  if (!node) return null;
  ctx.visitor(node);
  if (ctx.node === node) return null;
  ctx = { ...ctx, node };
  return exec(ctx, ctx.ast);
};
const main = (_ctx: Context, result: unknown) => {
  return result;
};

const ops: Record<string, any> = {
  or,
  and,
  cookie,
  go,
  here,
  left,
  right,
  back,
  nothing,
  main,
};

export function compile(ctx: Context): Context {
  return exec(ctx, ctx.ast);
}
