import * as TurndownService from 'turndown'

export default function (turndownService: TurndownService): void {
  turndownService.addRule('noscript', {
    filter: ['noscript'],
    replacement: function () {
      return ``
    },
  })
}
