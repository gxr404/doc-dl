import { Command } from 'commander'
import packageJson from '../package.json'
import { options } from './options'

/**
 * shell参数初始化 并合并config
 */
const shellArgsInit = (): void => {
  const program = new Command()
  // shell 参数
  program
    .version(packageJson.version) //定义版本号
    .option('-u, --url <url>', '文章url')
    .option('-t, --title <title>', '自定义文章标题')
    .option('-d, --dist <path>', '生成的目录(eg: -d res)')
    .option('-i, --img-dir <path>', '生成目录内图片目录(eg: -i ./img/20)')
    .option(
      '-l, --lax',
      'puppeteer的waitUntil, 宽松的请求[domcontentloaded, networkidle2], 默认严格的请求[load, networkidle0]'
    )
    .option('--timeout <timeout>', '图片下载超时时间, 默认0不设置超时时间')
  // 帮助
  program.on('--help', () => {
    console.log('\nExamples:')
    console.log('  $ custom-help --help')
    console.log('  $ custom-help -h')
  })
  //解析命令行参数,参数定义完成后才能调用
  program.parse(process.argv)
  const programOpt = program.opts()

  // 校验shell参数 并与就参数合并
  const argsKey = Object.keys(options)
  const shellArgs: { [key: string]: string } = {}

  argsKey.forEach((key) => {
    if (checkOptions(programOpt[key], key)) {
      shellArgs[key] = programOpt[key]
    }
  })
  // config 更新
  Object.assign(options, shellArgs)

  if (!options.url) {
    console.error('-u, --url <url> 必须！')
    process.exitCode = 1
    process.exit(1)
  }
}

/**
 * 校验shell参数
 * @param {*} val
 */
const checkOptions = (val: string, key: string) => {
  const ignoreKey = ['lax']
  if (ignoreKey.includes(key)) return true
  if (!val) return false
  // 排除空格
  if (typeof val === 'string' && val.trim() === '') return false
  // - 开头的参数 排除
  if (val.startsWith('-')) return false
  // 校验path后缀
  if (key === 'url' && !checkUrl(val)) {
    console.log('非合法url')
    return false
  }
  return true
}

/**
 * 检查是否合法的url
 * @param {string} href 目标路径
 * @return {boolean}
 */
const checkUrl = (href: string): boolean => {
  const reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w\- ./?%&=]*)?/
  return reg.test(href)
}

export { shellArgsInit }
