const config = {
  path: '',
  suffix: '',
  dist: './res/',
  imgDir:`./img/${Date.now()}`,
  // markdown img 正则 注意多行匹配
  mdImgReg: /!\[(.*?)\]\((.*?)\)/gm,
  isIgnoreConsole: false
}

export default config