import TurndownService from 'turndown'

function fixUrl(url: string) {
  if (!url) {
    return
  }
  if (url.startsWith('//')) {
    return `${window.location.protocol}${url}`
  }
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`
  }
  return url
}

export default function (turndownService: TurndownService) {
  turndownService.addRule('zhihuGif', {
    filter: (node) => {
      if (!(node instanceof Object)) {
        return false
      }
      if (node.tagName !== 'IMG') {
        return false
      }
      if (!node.getAttribute('class') || !node.getAttribute('data-thumbnail')) {
        return false
      }
      const className = node.getAttribute('class') as string
      if (className !== 'ztext-gif') {
        return false
      }
      return true
    },
    replacement: function (_: any, node: any) {
      let src = node.getAttribute('data-thumbnail') as string
      if (src) {
        const index = src.lastIndexOf('.')
        src = src.slice(0, index).concat('.gif')
        return `![](${fixUrl(src)})\n`
      }
      return ''
    }
  })
}
