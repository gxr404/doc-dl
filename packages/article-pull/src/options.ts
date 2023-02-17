export const options = {
  /** 文章url */
  url: '',
  /** 自定义的文章标题 */
  title: '',
  /** 生成目录 */
  dist: './res',
  /** 自定义图片目录 */
  imgDir: './img/',
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'

export const puppeteerOptions = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certificate-errors',
    '--ignore-certificate-errors-spki-list',
    `--user-agent=${UA}`
  ],
  headless: true,
  ignoreHTTPSErrors: true
}