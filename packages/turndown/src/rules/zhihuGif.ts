import * as TurndownService from 'turndown'
import { IOptions } from '../index'
import utils from '../utils/index'

export default function (options: IOptions) {
  return (turndownService: TurndownService): void => {
    turndownService.addRule('zhihuGif', {
      filter: (node) => {
        if (!(node instanceof Object)) {
          // TODO node instanceof HTMLElement
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
          return `![](${utils.fixUrl(src, options.articleUrl)})\n`
        }
        return ''
      }
    })
  }
}
