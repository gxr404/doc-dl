# article-pull

获取url中的文章转成markdown保存，并下载文章中的图片到本地

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
article-pull -u https://segmentfault.com/a/1190000040747951
```

## 实现原理

1. 使用`Puppeteer`爬取url中的`html`内容
2. `@mozilla/readability`解析出html中的文章内容和标题
3. 使用`turndown`将html的文章内容装成markdown
4. 将解析出来的markdown中的图片下载并更新markdown中的图片路径
