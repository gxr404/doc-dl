import * as path from 'path'
import { Command } from 'commander'
import getLogger from './log'
import config from './config'
import * as packageJson from '../package.json'

const logger = getLogger()

/**
 * shell参数初始化 并合并config
 */
const shellArgsInit = (): void => {
  const program = new Command()
  // shell 参数
  program
    .version(packageJson.version) //定义版本号
    .option('-p, --path <path>', 'markdown 目标文件')
    .option('-s, --suffix <suffix>', '需要更改下载的图片的后缀的话 后缀(eg: -s jpg)')
    .option('-d, --dir <path>', '生成的目录(eg: -d res)')
    .option('-i, --img-dir <path>', '生成目录内图片目录(eg: -i ./img/20)')
  // 帮助
  program.on('--help', () => {
    console.log('')
    console.log('Examples:')
    console.log('  $ custom-help --help')
    console.log('  $ custom-help -h')
  })
  //解析命令行参数,参数定义完成后才能调用
  program.parse(process.argv)
  const programOpt = program.opts()

  // 校验shell参数 并与就参数合并
  const argsKey = Object.keys(config)
  const shellArgs: { [key: string]: string } = {}

  argsKey.forEach((key) => {
    if (checkOptions(programOpt[key], key)) {
      shellArgs[key] = programOpt[key]
    }
  })

  // config 更新
  Object.assign(config, shellArgs)

  if (!config.path) {
    logger.error('-p, --path <path> 必须！')
    process.exitCode = 1
    process.exit(1)
  }
}

/**
 * 校验shell参数
 * @param {*} val
 */
const checkOptions = (val: string, key: string) => {
  if (!val) return false
  // 排除空格
  if (typeof val === 'string' && val.trim() === '') return false
  // - 开头的参数 排除
  if (val.indexOf('-') === 0) return false
  // 校验path后缀
  if (key === 'path' && !checkSuffix(val)) return false
  return true
}

/**
 * 检查后缀
 * @param {*} pathArg 目标路径
 * @return {boolean}
 */
const checkSuffix = (pathArg: string) => {
  const suffix = ['.md']
  const targetSuffix = path.extname(pathArg)
  if (suffix.indexOf(targetSuffix) < 0) {
    logger.error('非法文件后缀~  o(╥﹏╥)o')
    return false
  }
  return true
}

export {
  shellArgsInit
}