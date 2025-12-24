import fs from 'fs'
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'
import TurndownService from 'turndown'
import puppeteer from 'puppeteer'
import * as mdImg from 'pull-md-img'
import getArticleTurndown from '@doc-dl/turndown'
import { shellArgsInit } from './args'
import { options, puppeteerOptions } from './options'
import packageJson from '../package.json'
import { createDir } from './utils'

type TOptions = typeof options
interface AnyObject {
  [key: string]: any
}

/**
 * 添加脚注额外信息
 */
const addExtendInfo = (
  mdContent: string,
  options: TOptions,
  article: AnyObject
): string => {
  const title = options.title || article.title || ''
  if (title) {
    mdContent = `# ${title}\n<!--page header-->\n\n${mdContent}\n\n<!--page footer-->\n---\n- 原文: <${options.url}>\n`
  }
  return mdContent
}

/**
 * 根据url爬取document内容
 * @param url 文章链接
 * @returns
 */
const getDocument = async (
  url: string,
  isLaxRequest = false,
  customHeader: Record<string, string>
): Promise<string> => {
  // console.time('browser')
  const browser = await puppeteer.launch(puppeteerOptions)
  // console.timeEnd('browser')

  // console.time('page')
  const page = await browser.newPage()

  // 禁用javascript 防止 页面内js逻辑刷新
  await page.setJavaScriptEnabled(false)
  // 开启 request 拦截
  await page.setRequestInterception(true)
  // 设置请求头
  page.on('request', (request) => {
    // 非通过导航栏的请求不做修改
    if (!request.isNavigationRequest()) {
      request.continue()
      return
    }
    // Add a new header for navigation request.
    const headers = request.headers()
    Object.assign(headers, customHeader)
    request.continue({ headers })
  })

  await page.goto(url, {
    timeout: 0,
    waitUntil: isLaxRequest
      ? ['domcontentloaded', 'networkidle2']
      : ['load', 'networkidle0']
    // domcontentloaded 等待 DOMContentLoaded事件
    // load 等待load事件
    // networkidle0: 网络空闲的状态，也就是没有任何网络连接在 500 毫秒内活跃。具体来说，它意味着页面上所有的网络连接都已经完成，没有任何请求在进行或等待响应
    // networkidle2: 网络连接减少到 2 个以下，并保持 500 毫秒。
    //   这种情况下，页面可以有最多 1-2 个网络连接仍然活跃，而不会认为页面已经完全加载完毕。某些网站可能会有持续不断的后台请求。
  })

  // console.time('eval')
  const html = (await page.$eval('html', (node) => node.outerHTML)) || ''

  browser.close()
  return html
}

export const run = async (options: TOptions): Promise<void> => {
  const turndownService = new TurndownService({
    codeBlockStyle: 'fenced',
    headingStyle: 'atx',
    emDelimiter: '*',
    bulletListMarker: '-'
  })

  turndownService.use(
    getArticleTurndown({
      articleUrl: options.url
    })
  )

  const errorPrefix = `${packageJson.name}[ERROR]: `
  const infoPrefix = `${packageJson.name}[INFO]: `

  console.log(
    '----由于爬取页面可能为SPA页面需等待页面所有js请求都加载完毕后爬取该过程比较耗时,请耐心等待----'
  )
  console.log('爬取页面中...')

  const htmlContext = await getDocument(
    options.url,
    options.lax,
    options.headerObj
  ).catch((e) => {
    console.log(errorPrefix)
    console.log(e)
    return ''
  })

  if (!htmlContext) {
    console.log(`${errorPrefix}爬取内容异常 (╥﹏╥)`)
    return
  }

  console.log(`${infoPrefix}√ 爬取页面`)

  const dom = new JSDOM(htmlContext)
  const newDom = dom.window.document.cloneNode(true) as Document
  const reader = new Readability(newDom, {
    keepClasses: true
  })

  const article = reader.parse() || { title: options.title, content: '' }
  const title = options.title || article.title
  let mdContent = turndownService.turndown(article.content)

  console.log(`${infoPrefix}√ 转换markdown`)

  // 添加标题和原文链接
  mdContent = addExtendInfo(mdContent, options, article)

  const oldMdContent = mdContent

  const { data } = await mdImg
    .run(mdContent, {
      path: '',
      suffix: '',
      dist: options.dist,
      imgDir: `${options.imgDir}${Date.now()}`,
      isIgnoreConsole: true,
      referer: options.url || '',
      timeout: options.timeout
    })
    .catch((err) => {
      console.log(`${errorPrefix}`)
      console.log(err)
      console.log(`${errorPrefix}图片下载失败, 仅作转换`)
      return {
        data: mdContent
      }
    })
  mdContent = data
  await createDir(`${options.dist}`)

  // 无更改则无图片下载
  if (mdContent !== oldMdContent) {
    console.log(`${infoPrefix}√ 下载markdown中的图片`)
  }
  const fileNameReg = new RegExp('[\\\\/:*?\\"\'<>|\\s]', 'g')
  const fileName = `${title}.md`.replace(fileNameReg, '_')
  const distPath = `${options.dist}/${fileName}`
  fs.writeFileSync(distPath, mdContent)

  console.log(`${infoPrefix}\\(^o^)/ success ${distPath}`)
}

/**
 * 初始化
 */
export const bin = async (): Promise<void> => {
  // shell参数初始化 并合并config
  shellArgsInit()

  await run(options)
}
