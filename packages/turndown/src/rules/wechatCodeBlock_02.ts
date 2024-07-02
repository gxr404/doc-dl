import TurndownService from 'turndown'

/***
 * @see https://mp.weixin.qq.com/s?__biz=MzI5MDU1NDk2MA==&mid=2247498027&idx=1&sn=6800b032fb7d44edf98b8a95187a3d73&chksm=ec1cac14db6b25022aecbca4b54b9e76f8c5de9a448d0fcc4f36b7ef45daaa25b32829c24b6b&mpshare=1&scene=1&srcid=0705wiugytlqGGwTNXkOLbDg&sharer_sharetime=1625461719842&sharer_shareid=281a1f9b75644e2eb48c1428a30cf0a9#rd
 * 干货 | Spring系列CVE以及POC编写 from @HACK学习呀
 */
export default function (turndownService: TurndownService) {
  turndownService.addRule('wechatCodeBlock_02', {
    filter: (node) => {
      if (!(node instanceof Object)) {
        return false
      }
      if (node.tagName !== 'SECTION') {
        return false
      }
      if (!node.className.includes('code-snippet__github')) {
        return false
      }
      if (
        !node.querySelector('pre') ||
        node.querySelectorAll('code').length === 0
      ) {
        return false
      }
      return true
    },
    replacement: function (content: string, node) {
      if (!(node instanceof Object)) {
        return content
      }
      const pre = node.querySelector('pre')
      const language = pre?.getAttribute('data-lang')
      const finalCode = Array.from(node.querySelectorAll('code'))
        .map((o) => o.textContent)
        .join('\n')
      if (language) {
        return `\`\`\`${language}\n${finalCode}\n\`\`\`\n\n`
      }
      return `\`\`\`\n${finalCode}\n\`\`\`\n\n`
    }
  })
}
