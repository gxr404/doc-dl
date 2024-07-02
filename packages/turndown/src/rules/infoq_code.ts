import TurndownService from 'turndown'

export default function (turndownService: TurndownService) {
  turndownService.addRule('infoq_code', {
    filter: (node) => {
      if (!(node instanceof Object)) {
        return false
      }
      if (node.tagName !== 'DIV') {
        return false
      }
      if (node.getAttribute('data-type') !== 'codeblock') {
        return false
      }
      if (
        !node.querySelector('.simplebar') ||
        !node.querySelector('[data-origin=pm_code_preview]')
      ) {
        return false
      }
      return true
    },
    replacement: function (content: string, node) {
      if (!(node instanceof Object)) {
        return content
      }
      const lines =
        node.querySelectorAll('[data-type=codeline]') ?? ([] as Element[])
      const finalCode = Array.from(lines)
        .map((o) => o.textContent)
        .join('\n')
        .trim()
      return `\`\`\`\n${finalCode}\n\`\`\`\n\n`
    }
  })
}
