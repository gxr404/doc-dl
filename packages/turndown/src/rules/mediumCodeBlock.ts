import TurndownService from 'turndown'

export default function (turndownService: TurndownService) {
  turndownService.addRule('mediumCodeBlock', {
    filter: (node) => {
      if (!(node instanceof Object)) {
        return false
      }
      if (node.tagName !== 'PRE') {
        return false
      }
      if (!node.className) {
        return false
      }
      const codeLine = node.querySelectorAll('span[data-selectable-paragraph]')
      if (!codeLine) {
        return false
      }
      return true
    },
    replacement: function (content: string, node: Node) {
      if (!(node instanceof Object)) {
        return content
      }
      return `\`\`\`\n${content}\n\`\`\`\n\n`
    }
  })
}
