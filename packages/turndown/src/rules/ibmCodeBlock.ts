import TurndownService from 'turndown'

export default function (turndownService: TurndownService) {
  turndownService.addRule('wechatCodeBlock', {
    filter: (node) => {
      if (!(node instanceof Object)) {
        return false
      }
      if (node.tagName !== 'DIV') {
        return false
      }
      if (!node.className || !node.className.includes('syntaxhighlighter')) {
        return false
      }
      const code = node.querySelector('div.container')
      if (!code) {
        return false
      }
      return true
    },
    replacement: function (content: string, node) {
      if (!(node instanceof Object)) {
        return content
      }
      const codeNode = node.querySelector('div.container')
      const finalCode = Array.from(codeNode!.querySelectorAll('.line'))
        .map((o) => o.textContent)
        .join('\n')
      return `\`\`\`\n${finalCode}\n\`\`\`\n\n`
    }
  })
}
