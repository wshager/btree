export function reduceAround<U, T = unknown>(
  arr: T[],
  callbackfn: (
    previousValue: U,
    currentValue: T,
    lastValue: T | undefined,
    nextValue: T | undefined,
    currentIndex: number,
    array: T[]
  ) => U,
  initialValue?: U,
  lastSeed?: T,
  nextSeed?: T
) {
  const l = arguments.length;
  let tmp: { out: U; last: T | undefined; entry: T; at: number } = {
    out: (l < 3 ? (arr.shift() as unknown) : initialValue) as U,
    last: lastSeed,
    entry: arr.shift()!,
    at: l < 3 ? 1 : 0,
  };
  tmp = arr.reduce(function (tmp, next) {
    const out = callbackfn.call(
      arr,
      tmp.out,
      tmp.entry,
      tmp.last,
      next,
      tmp.at,
      arr
    );
    tmp.out = out;
    tmp.last = tmp.entry;
    tmp.entry = next;
    tmp.at = tmp.at + 1;
    return tmp;
  }, tmp);
  return callbackfn.call(
    arr,
    tmp.out,
    tmp.entry,
    tmp.last,
    nextSeed,
    tmp.at,
    arr
  );
}
