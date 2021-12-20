import { breadthFirst, create } from ".";
import { compile } from "./compile";
import { parse } from "./parse";
import XTree from "./assets/tree.svg?raw";
import { Node } from "./node";
import "./style.css";

function dimension(rows: number, i: number): number {
  const n = Math.floor(Math.log2(i + 1));
  return rows - n;
}

const app = document.querySelector<HTMLDivElement>("#app")!;
const depth = 8;
const data = createData(depth);

function createData(depth: number) {
  const tree = create(depth);
  const vals = Array.from(breadthFirst(tree.root));
  const cookie = Math.ceil(Math.random() * (Math.pow(2, depth) - 1));
  const mouse = tree.root?.data;
  return { depth, tree, vals, mouse, cookie, place: 0, feedback: "" };
}

function updateData(depth: number) {
  const { tree, vals, cookie, mouse } = createData(depth);
  data.tree = tree;
  data.vals = vals;
  data.mouse = mouse;
  data.cookie = cookie;
}

render({
  ...data,
  feedback: "",
});

const runState = { runs: 0, failures: 0, errors: 0 };
const failureMessages = [
  "",
  "Just keep trying.",
  "Think like a mouse, you know, logically.",
  "It's not that kind of tree...",
  "It's a binary tree!",
  "Let it snow, let it snow, let it snow.",
  "Down the rabbit hole we GO!",
  "It's the most wonderful time...",
  "Just like that famous Dutch cocoa brand.",
  "Is the cookie here? Where to go?",
  "Curses! Curses!",
];
const errorMessages = [
  "",
  "Aren't you tired yet?",
  "Stop running around!",
  "Quit fooling around!",
  "Stop wasting time!",
  "There and back again?",
];
const successMessages = [
  "",
  "Nom nom nom!",
  "Oh no, I shouldn't!",
  "Lekker!",
  "Heerlijk!",
  "Afblijven.",
];

function getFailureMessage() {
  const index =
    runState.failures <= failureMessages.length
      ? runState.failures - 1
      : Math.floor(Math.random() * failureMessages.length);
  return failureMessages[index];
}

function getErrorMessage() {
  const index =
    runState.errors <= errorMessages.length
      ? runState.errors - 1
      : Math.floor(Math.random() * errorMessages.length);
  return errorMessages[index];
}

function getSuccessMessage() {
  const index =
    runState.runs <= successMessages.length
      ? runState.runs - 1
      : Math.floor(Math.random() * successMessages.length);
  return successMessages[index];
}

(window as any).go = async (e: KeyboardEvent) => {
  const stack: unknown[] = [];
  try {
    if (e.type === "keypress" && (e.which !== 13 || e.shiftKey)) return;
    const input = (document.getElementById("input") as HTMLInputElement).value;
    if (!input.trim()) {
      const feedback = `<div class="failure" style="margin-left:${
        Math.random() * 40
      }px;margin-top:${Math.random() * 40}px;">No input, no cookie!</div>`;
      updateData(depth);
      return render({ ...data, feedback });
    }
    const ast = parse(input.trim());
    const result = compile({
      node: data.tree.root,
      cookie: data.cookie,
      ast,
      visitor: (node) => {
        stack.push(node.data);
      },
      callCount: 0,
      stackSize: Math.pow(2, depth),
    });
    while (stack.length) {
      data.mouse = stack.shift();
      const success = result === data.mouse;
      if (success) runState.runs++;
      await new Promise((res) => {
        setTimeout(res, 50 + Math.random() * 100);
      });
      render({
        ...data,
        feedback: success ? "Cookie found!<br/>" + getSuccessMessage() : "",
      });
      if (success) break;
    }
    if (result) {
      if (typeof result === "object" && result instanceof Node) {
        render({
          ...data,
          place: result.data as number,
        });
      }
    } else {
      runState.failures++;
      const feedback = `<div class="failure" style="margin-left:${
        Math.random() * 40
      }px;margin-top:${
        Math.random() * 40
      }px;">No cookie!<br/>${getFailureMessage()}</div>`;
      render({
        ...data,
        feedback,
      });
    }
  } catch (err) {
    runState.errors++;
    while (stack.length) {
      data.mouse = stack.shift();
      await new Promise((res) => {
        setTimeout(res, 50 + Math.random() * 100);
      });
      render(data);
    }
    const feedback = `<div class="failure" style="margin-left:${
      Math.random() * 40
    }px;margin-top:${
      Math.random() * 40
    }px;">${err}.<br/>${getErrorMessage()}</div>`;
    render({
      ...data,
      feedback,
    });
  } finally {
    updateData(depth);
    document.getElementById("input")?.focus();
  }
};

function render({
  depth,
  vals,
  mouse,
  cookie,
  feedback,
  place,
}: {
  depth: number;
  vals: unknown[];
  mouse: unknown;
  cookie: number;
  feedback?: string;
  place?: number;
}) {
  app.innerHTML = `
  <h1>Merry X-Mas Mouse Mayhem</h1>
  <div class="xtree">
  ${XTree}
  </div>
  <div class="nodes">
    ${vals
      .map(
        (val, i) =>
          `<span class="node-data ${val === cookie ? "cookie" : ""}
          ${val === mouse ? "mouse" : ""} ${
            val === place ? "place" : ""
          }" style="margin-top:${109 / dimension(depth, i)}px;width:${
            dimension(depth, i) * 3.9
          }px;transform:rotate(${Math.floor(
            Math.random() * 360
          )}deg) translateY(${Math.floor(
            Math.random() * 10
          )}px);">${val}</span>${
            Number.isInteger(Math.log2(i + 2)) ? "<br><br>" : ""
          }`
      )
      .join("")}
  </div>
  <div class="story">
    <div class="text-container">
      <div class="text">You have to do the Mouse King's bidding until Christmas morning and the mighty King is always hungry.</div>
      <div class="text">Help! The clock has just struck midnight, the Mouse King has awoken and he has transformed you into a tiny mouse!</div>
      <div class="text">There is a cookie in the tree you have to fetch for him, but how to reach it from the peak? Find help below!</div>
    </div>
  </div>
  <div class="details-row">
    <div class="details-text">
      <h2>Go! Go! Go!</h2>
      <p>There is a simple phrase that helps you find the cookie.<br/>These are the terms you can use:
        <ul>
          <li><span class="term">AND</span> stands between things that should both be true.</li>
          <li><span class="term">OR</span> stands between things that could both be true.</li>
          <li><span class="term">HERE</span> is the place where you currently are.</li>
          <li><span class="term">LEFT</span> is the place that is to your right.</li>
          <li><span class="term">RIGHT</span> is the place that is to your left.</li>
          <li><span class="term">BACK</span> is the place you just came from.</li>
          <li><span class="term">NOTHING</span> means: No cookie!</li>
          <li><span class="term">COOKIE</span> asks: Is the cookie in that place?</li>
          <li><span class="term">GO</span> deeply shouts: Go, go, go to that place!</li>
        </ul>
      </p>
    </div>
    <div class="details-text">
      <h2>Some examples</h2>
      <p>
        <span class="term">COOKIE HERE</span> asks:<br/> Is the cookie in the place I currently am?
      </p>
      <p>
        <span class="term">GO LEFT</span> deeply shouts:<br/> Go, go, go to my right!
      </p>
      <p>
        <span class="term">COOKIE LEFT OR COOKIE RIGHT</span> asks:<br/> Is the cookie to my right or to my left?
      </p>
      <p><strong>Find the text input below the tree and the cookie</strong></p>
    </div>
  </div>
  <div class="interaction">
    <textarea id="input" onkeypress="go(event)"></textarea><button onclick="go(event)">Go!</button>
  </div>
  <div id="feedback">${feedback}</div>
  `;
}
