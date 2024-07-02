import TurndownService from 'turndown'
import { codeBlock } from '../utils'

export default function (turndownService: TurndownService) {
  turndownService.addRule('mediumCodeBlock', {
    filter: (node) => {
      if (!(node instanceof Object)) {
        return false
      }
      if (node.tagName !== 'PRE') {
        return false
      }
      if (!node.className.includes('contain-cm')) {
        return false
      }
      const firstChild = node.firstChild as HTMLElement
      if (!(firstChild instanceof Object)) {
        return false
      }
      if (!firstChild.className.includes('CodeMirror')) {
        return false
      }
      return true
    },
    replacement: function (content: string, node: HTMLElement) {
      if (!(node instanceof Object)) {
        return content
      }

      const codeMirrorLines = node.querySelectorAll('.CodeMirror-line')
      if (!codeMirrorLines || codeMirrorLines.length === 0) {
        return ''
      }
      const code = Array.from(codeMirrorLines)
        .map((o) => o.textContent)
        .join('\n')

      const lang = node.getAttribute('lang')
      return codeBlock(code, lang)
    }
  })
}
