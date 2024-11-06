const config = {
  path: '',
  suffix: '',
  dist: './res/',
  imgDir: `./img/${Date.now()}`,
  // markdown img 正则 注意多行匹配
  mdImgReg: /!\[(.*?)\]\((.*?)\)/gm,
  isIgnoreConsole: false,
  /** 含有错误仍然返回 忽略错误的图片 */
  errorStillReturn: false,
  referer: '',
  transform: (url: string) => url,
  timeout: 0
}

export function resetConfig(needResetConfig: typeof config) {
  Object.assign(needResetConfig, {
    path: '',
    suffix: '',
    dist: './res/',
    imgDir: `./img/${Date.now()}`,
    // markdown img 正则 注意多行匹配
    mdImgReg: /!\[(.*?)\]\((.*?)\)/gm,
    isIgnoreConsole: false,
    /** 含有错误仍然返回 忽略错误的图片 */
    errorStillReturn: false,
    referer: '',
    transform: (url: string) => url
  })
}

export default config
