import * as TurndownService from 'turndown'

export default function (turndownService: TurndownService): void {
  turndownService.addRule('infoq_code', {
    filter: (node) => {
      if (!(node instanceof Object)) {
        // TODO node instanceof HTMLElement
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
    replacement: function (content: string, node: HTMLElement) {
      if (!(node instanceof Object)) {
        // TODO node instanceof HTMLElement
        return content
      }
      const lines =
        node.querySelectorAll('[data-type=codeline]') ?? ([] as ArrayLike<any>)
      const finalCode = Array.from(lines)
        .map((o) => o.textContent)
        .join('\n')
        .trim()
      return `\`\`\`\n${finalCode}\n\`\`\`\n\n`
    }
  })
}
