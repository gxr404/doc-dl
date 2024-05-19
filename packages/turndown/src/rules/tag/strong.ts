import * as TurndownService from 'turndown'

export default function (turndownService: TurndownService): void {
  turndownService.addRule('tag_string', {
    filter: ['b', 'strong'],
    replacement: function (content: string) {
      if (typeof content !== 'string' || !content.trim()) {
        return ''
      }
      const result = content.trim()
      if (['：', '】', '▐', '。'].some((o) => result.endsWith(o))) {
        return `**${result}** `
      }
      return `**${result}**`
    }
  })
}
