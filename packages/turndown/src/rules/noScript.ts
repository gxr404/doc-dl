import TurndownService from 'turndown'

export default function (turndownService: TurndownService) {
  turndownService.addRule('noscript', {
    filter: ['noscript'],
    replacement: function () {
      return ``
    }
  })
}
