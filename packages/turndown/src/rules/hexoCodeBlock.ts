import * as TurndownService from 'turndown'

export default function (turndownService: TurndownService): void {
  turndownService.addRule('hexoCodeBlock', {
    filter: ['figure', 'table'],
    replacement: function (content: string, node: HTMLElement) {
      if (!(node instanceof Object)) {
        // TODO node instanceof HTMLElement
        return content
      }
      let language = ''
      if (node.tagName === 'FIGURE') {
        const className = node.getAttribute('class')
        if (className) {
          const match = className.match(/highlight (.*)/)
          if (match) {
            language = match[1]
          }
        }
      }
      const gutter = node.querySelector('.gutter')
      const code = node.querySelector('td.code')
      if (!code || !gutter) {
        return content
      }
      const codeArray = Array.from(code.querySelectorAll('.line'))
      if (!Array.isArray(codeArray)) {
        return content
      }
      const finalCode = codeArray.map((o) => o.textContent).join('\n')
      return `\`\`\`${language}\n${finalCode}\n\`\`\`\n\n`
    }
  })
}
