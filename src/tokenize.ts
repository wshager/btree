import { reduceAround } from "./reduce-around";
import { binaryOps, constants, unaryOps } from "./terms";

const allowedTerms = [...binaryOps, ...constants, ...unaryOps];

export function tokenize(input: string): string[] {
  const tokens = input.split(/\s+/g);
  return reduceAround(
    tokens,
    (acc: string[], term, last, next) => {
      if (!allowedTerms.includes(term))
        throw new SyntaxError(`'${term}' is not recognized`);
      if (binaryOps.includes(term)) {
        if (!next || !last)
          throw new SyntaxError(`'${term}' does not have any operands`);
        if (binaryOps.includes(last))
          throw new SyntaxError(`'${term}' should not be preceded by ${last}`);
        if (binaryOps.includes(next))
          throw new SyntaxError(`'${term}' should not be followed by ${next}`);
      }
      if (unaryOps.includes(term)) {
        if (!next) throw new SyntaxError(`'${term}' does not have an operand`);
        if (!constants.includes(next))
          throw new SyntaxError(`'${term}' should be preceded by a constant`);
      }
      if (constants.includes(term)) {
        if (last && constants.includes(last))
          throw new SyntaxError(`'${term}' should not be preceded by ${last}`);
        if (next && constants.includes(next))
          throw new SyntaxError(`'${term}' should not be followed by ${next}`);
      }
      acc.push(term);
      return acc;
    },
    []
  );
}
