import * as TurndownService from 'turndown'
import { IOptions } from '../index'
import utils from '../utils/index'

export default function (options: IOptions) {
  return (turndownService: TurndownService): void => {
    turndownService.addRule('lazyLoadImage', {
      filter: ['img'],
      replacement: function (_: any, node: any) {
        const attributes = ['data-src', 'data-original-src']
        for (const attribute of attributes) {
          const dataSrc: string = node.getAttribute(attribute)
          if (dataSrc) {
            return `![](${utils.fixUrl(dataSrc, options.articleUrl)})\n`
          }
        }
        const src = node.getAttribute('src')
        if (src) {
          return `![](${utils.fixUrl(node.getAttribute('src'), options.articleUrl)})\n`
        }
        return ''
      }
    })
  }
}
