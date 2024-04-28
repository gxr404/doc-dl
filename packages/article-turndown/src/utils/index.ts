const fixUrl = (url: string, articleUrl: string): string => {
  if (!url) {
    return ''
  }
  const urlObj = new URL(articleUrl)
  if (url.startsWith('//')) {
    return `${urlObj.protocol}${url}`
  }
  if (url.startsWith('/')) {
    return `${urlObj.origin}${url}`
  }
  return url
}

const codeBlock = (code: string, language?: string | null): string => {
  let languageString = language
  if (typeof language !== 'string') {
    languageString = ''
  }
  if (typeof code !== 'string' || !code) {
    return ''
  }
  return `\`\`\`${languageString}\n${code}\n\`\`\`\n\n`
}

const notEmptyIndex = (data: any[], index: number): number => {
  let expect = index
  let start = 0
  while (expect >= 0) {
    if (typeof data[start] === 'undefined') {
      expect = expect - 1
      if (expect < 0) {
        return start
      }
    }
    start = start + 1
  }
  return start
}

export default {
  fixUrl,
  codeBlock,
  notEmptyIndex,
}
