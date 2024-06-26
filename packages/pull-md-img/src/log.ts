import log4js from 'log4js'

/**
 * log 初始化
 */
const getLogger = () => {
  log4js.configure({
    appenders: {
      // cheeseLog: { type: 'file', filename: 'cheese.log' },
      cheese: {
        type: 'console',
        layout: {
          // type: 'messagePassThrough',
          type: 'pattern',
          // pattern: '%[%d{yyyy-MM-dd hh:mm:ss} [%p] %c -%] %m%n'
          pattern: '%[%c [%p]:%] %m%n'
        }
      }
    },
    categories: { default: { appenders: ['cheese'], level: 'trace' } }
  })
  return log4js.getLogger('mdDownloadImg')
}

export default (() => {
  let logger: log4js.Logger
  return () => {
    if (logger) return logger
    logger = getLogger()
    return logger
  }
})()
