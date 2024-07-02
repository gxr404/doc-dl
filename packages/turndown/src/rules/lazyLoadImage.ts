import TurndownService from 'turndown'
import { IOptions } from '../index'

function fixUrl(url: string, rawUrl: string) {
  if (!url) return url
  try {
    const { protocol, origin } = new URL(rawUrl)
    if (url.startsWith('//')) {
      return `${protocol}${url}`
    }
    if (url.startsWith('/')) {
      return `${origin}${url}`
    }
    return url
  } catch (e) {
    return url
  }
}

export default function (options: IOptions) {
  return (turndownService: TurndownService): void => {
    turndownService.addRule('lazyLoadImage', {
      filter: ['img'],
      replacement: function (_: any, node: any) {
        const attributes = ['data-src', 'data-original-src']
        for (const attribute of attributes) {
          const dataSrc: string = node.getAttribute(attribute)
          if (dataSrc) {
            return `![](${fixUrl(dataSrc, options.articleUrl)})\n`
          }
        }
        const src = node.getAttribute('src')
        if (src) {
          return `![](${fixUrl(node.getAttribute('src'), options.articleUrl)})\n`
        }
        return ''
      }
    })
  }
}
