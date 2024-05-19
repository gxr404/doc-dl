# doc-dl

根据输入的文章url 抓取页面内容,并转成markdown，连同文章中的图片也给保存到本地

![example](/assets/example.gif)

## 安装

```shell
npm install -g doc-dl
```

```shell
Usage: index [options]

Options:
  -V, --version         output the version number
  -u, --url <url>       文章url
  -t, --title <title>   自定义文章标题
  -d, --dir <path>      生成的目录(eg: -d res)
  -i, --img-dir <path>  生成目录内图片目录(eg: -i ./img/20)
  -h, --help            display help for command

Examples:
  $ custom-help --help
  $ custom-help -h
```

## Usage

url文章链接支持大部分网站，如掘金/知乎文章/微信公众号文章...

```shell
doc-dl -u <url>
```

## 实现原理

1. 使用`Puppeteer`爬取url中的`html`内容
2. `@mozilla/readability`解析出html中的文章内容和标题
3. 使用`turndown`将html的文章内容装成markdown
4. 将解析出来的markdown中的图片下载并更新markdown中的图片路径
