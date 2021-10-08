import * as TurndownService from 'turndown'

export default function (turndownService: TurndownService): void {
  turndownService.addRule('mediumImage', {
    filter: (node) => {
      if (!(node instanceof Object)) { // TODO node instanceof HTMLElement
        return false
      }
      if (node.tagName !== 'IMG') {
        return false
      }
      if (!node.getAttribute('src') || !node.getAttribute('height') || !node.getAttribute('width')) {
        return false
      }
      const src = node.getAttribute('src') as string
      if (!src.startsWith('https://miro.medium.com/max/')) {
        return false
      }
      return true
    },
    replacement: function (content: string, node: HTMLElement) {
      if (!(node instanceof Object)) { // TODO node instanceof HTMLElement
        return content
      }
      const src = node.getAttribute('src') as string
      const width = node.getAttribute('width')
      const result = src.replace(/https:\/\/miro.medium.com\/max\/(\d*)\//, `https://miro.medium.com/max/${Number(width) * 2}/`)
      return `![](${result})`
    },
  })
}
