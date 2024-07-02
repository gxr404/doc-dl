import TurndownService from 'turndown'

export default function (turndownService: TurndownService) {
  turndownService.addRule('syntaxhighlighter', {
    filter: (node) => {
      if (!(node instanceof Object)) {
        return false
      }
      if (node.tagName !== 'TABLE') {
        return false
      }
      const hasCss = !node.className?.includes('syntaxhighlighter')
      if (!hasCss) {
        return false
      }
      if (!node.querySelector('.code') || !node.querySelector('.container')) {
        return false
      }
      return true
    },
    replacement: function (content: string, node) {
      if (!(node instanceof Object)) {
        return content
      }
      const lines =
        node.querySelector('.container')?.querySelectorAll('line') ||
        ([] as Element[])
      const finalCode = Array.from(lines)
        .map((o) => o.textContent)
        .join('\n')
      return `\`\`\`\n${finalCode}\n\`\`\`\n\n`
    }
  })
}
