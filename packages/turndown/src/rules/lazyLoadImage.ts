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
  turndownService.addRule('lazyLoadImage', {
    filter: ['img'],
    replacement: function (_: any, node: any) {
      const attributes = ['data-src', 'data-original-src']
      for (const attribute of attributes) {
        const dataSrc: string = node.getAttribute(attribute)
        if (dataSrc) {
          return `![](${fixUrl(dataSrc)})\n`
        }
      }
      const src = node.getAttribute('src')
      if (src) {
        return `![](${fixUrl(node.getAttribute('src'))})\n`
      }
      return ''
    }
  })
}
