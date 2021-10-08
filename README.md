# article-pull

根据输入的文章链接url 抓取页面内容,并转成markdown，其中文章有图片会保存到本地

## 安装

```shell
npm install -g article-pull
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

## example

```shell
article-pull -u https://文章链接...
```

## 该项目分以下三个包

- [article-pull](./packages/article-pull/README.md) 核心包
- [pull-md-img](./packages/pull-md-img/README.md) 下载markdown中的图片并更新markdown路径
- [article-turndown](./packages/article-turndown/README.md) 转markdown turndown 插件