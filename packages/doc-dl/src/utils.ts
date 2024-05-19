import fs from 'fs'
import path from 'path'

/**
 * 创建目录
 * @param {*} imgDir
 * @returns {Promise}
 */
const createDir = (imgDir: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    mkDirs(imgDir, (e) => {
      if (e) reject(e)
      resolve(void 0)
    })
  }).catch((e) => {
    console.log(e)
  })
}

/**
 * @description 为了兼容低版本ndoe 使其可以多层创建文件夹
 * @param {*} dirname
 * @param {*} callback
 */
const mkDirs = (dirname: string, callback: fs.NoParamCallback) => {
  fs.exists(dirname, function (exists) {
    if (exists) {
      callback(null)
    } else {
      mkDirs(path.dirname(dirname), () => {
        fs.mkdir(dirname, callback)
      })
    }
  })
}

export { createDir }
