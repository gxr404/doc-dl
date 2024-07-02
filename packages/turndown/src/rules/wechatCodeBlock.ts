import TurndownService from 'turndown'

export default function (turndownService: TurndownService) {
  turndownService.addRule('wechatCodeBlock', {
    filter: (node) => {
      if (!(node instanceof Object)) {
        return false
      }
      if (node.tagName !== 'SECTION') {
        return false
      }
      if (!node.className || !node.className.includes('code-snippet__js')) {
        return false
      }
      const pre = node.querySelector('pre.code-snippet__js')
      if (!pre) {
        return false
      }
      const language = pre!.getAttribute('data-lang')
      if (!language) {
        return false
      }
      return true
    },
    replacement: function (content: string, node) {
      if (!(node instanceof Object)) {
        return content
      }
      const pre = node.querySelector('pre.code-snippet__js')
      const language = pre!.getAttribute('data-lang')
      const finalCode = Array.from(pre!.querySelectorAll('code'))
        .map((o) => o.textContent)
        .join('\n')
      return `\`\`\`${language}\n${finalCode}\n\`\`\`\n\n`
    }
  })
}
