import * as TurndownService from 'turndown'
import utils from '../utils/index'

interface TableNode {
    colSpan: number
    rowSpan: number
    content: string
}

export default function (turndownService: TurndownService): void {
    turndownService.addRule('yuqueTableCard', {
        filter: (node) => {
            if (!(node instanceof Object)) { // TODO node instanceof HTMLElement
                return false
            }
            if (node.tagName !== 'TABLE') {
                return false
            }
            if (node.getAttribute('class') !== 'lake-table') {
                return false
            }
            return true
        },
        replacement: function (content: string, node: HTMLElement) {
            if (!(node instanceof Object)) { // TODO node instanceof HTMLElement
                return content
            }
            const lines = node.querySelectorAll('tr')
            const jsonNodes: TableNode[][] = []
            for (const line of Array.from(lines)) {
                const nodes = line.querySelectorAll('td')
                const nodesValue = Array.from(nodes).map((node) => ({
                    colSpan: Number(node.getAttribute('colspan')) || 1,
                    rowSpan: Number(node.getAttribute('rowspan')) || 1,
                    content: Array.from(node.querySelectorAll('p'))
                        .map((o) => o.textContent)
                        .join('<br />'),
                }))
                jsonNodes.push(nodesValue)
            }
            const result: string[][] = jsonNodes.map(() => [])
            jsonNodes.forEach((row, rowIndex) => {
                const foo: Omit<TableNode, 'colSpan'>[] = []
                row.forEach((o) => {
                const expectIndex = utils.notEmptyIndex(result[rowIndex], 0)
                for (let i = 0; i < o.colSpan; i++) {
                    for (let j = 0; j < o.rowSpan; j++) {
                        const first = i === 0 && j === 0
                        result[rowIndex + j][expectIndex + i] = first ? o.content : ''
                    }
                }
                })
                return foo
            })
            const divider = result[0].map(() => '-')
            result.splice(1, 0, divider)
            return `${result.map((row) => `|${row.join('|')}|`).join('\n')}\n\n`
        },
    })
}
