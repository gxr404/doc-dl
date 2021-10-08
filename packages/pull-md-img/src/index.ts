import * as fs from 'fs'
import * as path from 'path'
import * as url from 'url'

import * as progressBar from 'progress'
import getLogger from './log'
import config from './config'
import { shellArgsInit } from './args'

import {
  createDir,
  changeSuffix,
  checkProtocol,
  replaceSpecialReg,
  readFile,
  changeFileName
} from './utils'

// log 初始化
const logger = getLogger()

/**
 * 获取img 列表
 * @param {*} data
 * @returns {string[]}
 */
const getImgList = (data: string): Array<string> => {
  let list = data.match(config.mdImgReg) || []
  list = list.map(itemUrl => {
    itemUrl = itemUrl.replace(config.mdImgReg, '$2')
    const itemUrlObj = new url.URL(itemUrl)
    itemUrl = url.format(itemUrlObj, {
      fragment: false,
      unicode: false,
      auth: false,
      search: false
    })
    return itemUrl
  })
  // 去重
  const resSet = new Set(list)
  list = Array.from(resSet)
  return list
}

/**
 * 下载图片
 * @param {*} url
 * @param {*} imgDir
 */
const downloadImg = (url: string, imgDir: string): Promise<string> => {
  let fileName = path.basename(url)
  fileName = changeFileName(fileName)
  if (config.suffix) fileName = changeSuffix(fileName, config.suffix)

  // 检查协议
  const lib = checkProtocol(url)
  return new Promise((resolve, reject) => {
    const req = lib.request(url, (res) => {
      // 检查是否重定向
      const isRedirect = [302, 301].indexOf(res.statusCode)
      if (~isRedirect) {
        if (!config.isIgnoreConsole) {
          logger.info(`${fileName} 重定向...`)
        }
        // 重定向则向 响应头的location 重新下载
        resolve(downloadImg(res.headers['location'], imgDir))
        return
      }

      const contentLength = parseInt(res.headers['content-length'], 10)
      const distPath = `${imgDir}/${fileName}`
      const out = fs.createWriteStream(distPath)

      const bar = new progressBar(`downloading ${fileName} [:bar] :rate/bps :percent :etas`, {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: contentLength
      })

      res.on('data', (chunk) => {
          // 输入后的回调
        out.write(chunk, () => {
          if (!config.isIgnoreConsole) {
            bar.tick(chunk.length)
          }
          // logger.error('file wirte error: ',e)
        })
      })
      res.on('end', () => {
        // logger.info(`${fileName} download OK`)
        resolve(distPath)
      })

    })
    req.on('error', e => {
      logger.error(`download ${fileName} error:`, e)
      reject(e)
    })
    req.end()
  })
}

/**
 * 创建新的markdown并更改img Url
 * @param {string} data 处理的markdown数据
 * @param {array} imgList 图片列表
 * @return {string} 更改markdown中远程图片链接为本地链接
 */
const changeMarkdown = (data: string, imgList: Array<string>): string => {
  // 创建新的img url list
  const newImgList = imgList.map(src => {
    if (config.suffix) src = changeSuffix(src, config.suffix)

    const fileName = path.basename(src)
    return `${config.imgDir}/${fileName}`
  })

  let newData = data
  const list = data.match(config.mdImgReg) || []
  // 替换其中url文本
  list.forEach((src, index) => {
    // 动态reg
    const imgReg = new RegExp(replaceSpecialReg(src), 'gm')
    newData = newData.replace(imgReg, '![$1]('+newImgList[index]+')')
  })
  return newData

}

/**
 * 初始化
 */
export const bin = async (): Promise<void> => {
  // shell参数初始化 并合并config
  shellArgsInit()

  // 读取文件
  const data = await readFile(config.path)
  if (!data) {
    logger.error('o(╥﹏╥)o 读取失败')
    return
  }
  // 更改md文件
  const newData = await run(data, config)

  const fileName = path.basename(config.path)
  const out = fs.createWriteStream(path.resolve(config.dist, fileName))
  // 写入文件
  out.write(newData)

  setTimeout(() => {
    logger.info('success')
  }, 100)
}


type TConfig = Partial<typeof config>
/**
 * @param data
 */
export const run = async (data: string, customConfig: TConfig): Promise<string> => {
  Object.assign(config, customConfig)
  // 获取文件内容中的图片列表
  const imgList = getImgList(data)
  const imgDirPath = path.resolve(config.dist, config.imgDir)
  // 创建目录 img 目录
  await createDir(imgDirPath)
  const imgListPromise = imgList.map(src => {
    return downloadImg(src, imgDirPath)
  })
  const resList = await Promise.all(imgListPromise)
  // 更改md文件
  const newData = changeMarkdown(data, resList)
  return newData
}
