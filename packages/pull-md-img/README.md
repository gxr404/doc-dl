# mdDownloadImg

- 下载markdown中的图片
- 更改markdown中的图片路径改为本地
- 根据`Content-Type`定义图片后缀
- 302, 301重定向下载重定向后的target
- 随机ua头

## 安装

```shell
npm install -g pull-md-img
```

```shell
pull-md-img -h

Usage: pull-md-img [options]

Options:
  -V, --version          output the version number
  -p, --path <path>      markdown 目标文件
  -s, --suffix <suffix>  需要更改下载的图片的后缀的话 后缀(eg: -s jpg)
  -d, --dir <path>       生成的目录(eg: -d res)
  -i, --img-dir <path>   生成目录内图片目录(eg: -i ./img/20)
  -h, --help             output usage information

Examples:
  $ custom-help --help
  $ custom-help -h
```

## nodejs中使用

```js
const mdImg = require('pull-md-img')
const fs = require('fs')

const markdownText = '![xxx](https://pic3.zhimg.com/v2-fc83865f31f095893430a4dadb036a61_1440w.jpg)'

const distDir = 'dist'

mdImg.run(markdownText, {
  // 下载完后保存的图片后缀
  suffix: 'png',
  dist: distDir,
  imgDir: './img/1',
  // 忽略进度展示
  isIgnoreConsole: true
}).then((content) => {
  console.log(content) // ![xxx](./img/1/v2-fc83865f31f095893430a4dadb036a61_1440w-38475.png)
  fs.writeFileSync(`${distDir}/new.md`, content)
})
```