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
    mdContent = `# ${title}\n<!--page header-->\n\n${mdContent}\n\n<!--page footer-->\n- 原文: ${options.url}`
  }
  return mdContent
}

/**
 * 根据url爬取document内容
 * @param url 文章链接
 * @returns
 */
const getDocument = async (url: string): Promise<string> => {
  // console.time('browser')
  const browser = await puppeteer.launch(puppeteerOptions)
  // console.timeEnd('browser')

  // console.time('page')
  const page = await browser.newPage()
  // console.timeEnd('page')

  // console.time('goto')
  await page.goto(url, {
    timeout: 0,
    waitUntil: ['load', 'networkidle0']
    // TODO
    // waitUntil: ['domcontentloaded']
  })
  // console.timeEnd('goto')

  // console.time('eval')
  const html = (await page.$eval('html', (node) => node.outerHTML)) || ''
  // console.timeEnd('eval')

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

  const htmlContext = await getDocument(options.url).catch((e) => {
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
      referer: options.url || ''
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
