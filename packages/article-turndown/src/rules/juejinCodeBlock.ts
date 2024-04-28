import * as TurndownService from 'turndown'

export default function (turndownService: TurndownService): void {
  turndownService.addRule('juejinCodeBlock', {
    filter: (node) => {
      if (!(node instanceof Object)) {
        // TODO node instanceof HTMLElement
        return false
      }
      if (node.tagName !== 'PRE') {
        return false
      }
      // TODO debt
      // csdnCodeBlock
      if (node.className === 'prettyprint') {
        return false
      }
      const child = node.firstChild as HTMLElement
      if (!child) {
        return false
      }
      if (child.tagName !== 'CODE') {
        return false
      }
      if (!child.className.includes('hljs')) {
        return false
      }
      return true
    },
    replacement: function (content: string, node: HTMLElement) {
      if (!(node instanceof Object)) {
        // TODO node instanceof HTMLElement
        return content
      }
      node.querySelector('.copy-code-btn')?.remove()
      return `\`\`\`${(node.firstChild as HTMLElement)?.getAttribute('lang')}\n${node.firstChild?.textContent}\n\`\`\`\n\n`
    }
  })
}
