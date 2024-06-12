# doc-dl

根据输入的文章url 抓取页面内容,并转成markdown，连同文章中的图片也给保存到本地

![example](https://github.com/gxr404/doc-dl/assets/17134256/936d09f7-1212-421c-962f-0580492b7261)

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

## 该项目分以下三个包

- [doc-dl](./packages/doc-dl/README.md) 核心包
- [pull-md-img](./packages/pull-md-img/README.md) 下载markdown中的图片并更新markdown路径
- [turndown](./packages/turndown/README.md) 转markdown turndown 插件
