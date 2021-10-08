import * as TurndownService from 'turndown'

export default function (turndownService: TurndownService): void {
    turndownService.addRule('csdnCodeBlock', {
        filter: (node) => {
            if (!(node instanceof Object)) { // TODO node instanceof HTMLElement
                return false
            }
            if (node.tagName !== 'PRE') {
                return false
            }
            if (node.className !== 'prettyprint') {
                return false
            }
            const codeLine = node.querySelectorAll('code')
            if (!codeLine) {
                return false
            }

            return true
        },
        replacement: function (content: string, node: HTMLElement) {
            if (!(node instanceof Object)) { // TODO node instanceof HTMLElement
                return content
            }
            node.querySelector('.pre-numbering')?.remove()
            const codeBlock = node.querySelector('code')!
            const code = codeBlock.textContent
            let language = ''
            const languageMatchResult = codeBlock.className.match(/language-(.*) /)
            if (languageMatchResult) {
                language = languageMatchResult[1]
            }
            language = language.split(' ')[0]
            return `\`\`\`${language}\n${code}\n\`\`\`\n\n`
        },
    })
}
