import TurndownService from 'turndown'

// fix: li -> `*  `
// https://github.com/mixmark-io/turndown/blob/cc73387fb707e5fb5e1083e94078d08f38f3abc8/src/commonmark-rules.js#L64-L80
export default function (turndownService: TurndownService) {
  turndownService.addRule('listItem', {
    filter: 'li',
    replacement: function (content, node: HTMLElement, options) {
      content = content
        .replace(/^\n+/, '') // remove leading newlines
        .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
        // .replace(/\n/gm, '\n    ') // indent
        .replace(/\n(.+?)/gm, '\n    $1')
      // .replace(/\n(.*?)/gm, (text, $1) => {
      //   console.log(text, $1)
      //   return $1 ? '\n    '
      // }) // indent
      let prefix = `${options.bulletListMarker} `
      const parent = node.parentNode as HTMLElement
      if (parent.nodeName === 'OL') {
        const start = parent.getAttribute('start')
        const index = Array.prototype.indexOf.call(parent.children, node)
        prefix = (start ? Number(start) + index : index + 1) + '. '
      }
      return (
        prefix + content + (node.nextSibling ? '\n' : '')
        // prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
      )
    }
  })
}
