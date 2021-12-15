import { breadthFirst, create } from '.'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!
const tree = create(6)
const vals = Array.from(breadthFirst(tree.root))
console.log(tree.root)

const space = (rows: number, i: number) => {
  const n =  Math.floor(Math.log2(i + 1));
  return new Array(rows - n).fill('&nbsp;&nbsp;')
}

app.innerHTML = `
  ${vals.map((val, i) => `${val}${space(6, i).join('')}${Number.isInteger(Math.log2(i + 2))? '<br><br><br>' : ''}`).join('')}
`
