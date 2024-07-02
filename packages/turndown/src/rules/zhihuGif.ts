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
    turndownService.addRule('zhihuGif', {
      filter: (node) => {
        if (!(node instanceof Object)) {
          return false
        }
        if (node.tagName !== 'IMG') {
          return false
        }
        if (
          !node.getAttribute('class') ||
          !node.getAttribute('data-thumbnail')
        ) {
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
          return `![](${fixUrl(src, options.articleUrl)})\n`
        }
        return ''
      }
    })
  }
}
