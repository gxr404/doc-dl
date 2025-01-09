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
  -V, --version             output the version number
  -u, --url <url>           文章url
  -t, --title <title>       自定义文章标题
  -d, --dist <path>         生成的目录(eg: -d res)
  -i, --img-dir <path>      生成目录内图片目录(eg: -i ./img/20)
  -H, --header <header...>  与curl的-H参数一致, 用于自定义请求头
  -l, --lax                 puppeteer的waitUntil, 宽松的请求[domcontentloaded, networkidle2], 默认严格的请求[load, networkidle0]
  --timeout <timeout>       图片下载超时时间, 默认0不设置超时时间
  -h, --help                display help for command

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

## 注意

大多数网站 直接`doc-dl -u <url>`即可

有些比较刁钻的网站如 知乎 😂，就需要通过带上自定义header参数来提高成功率

例如

```bash
doc-dl -u "https://zhuanlan.zhihu.com/p/10673225170"
# 打开markdown文件结果是 "{"error":{"message":"您当前请求存在异常，暂时限制本次访问。如有疑问，您可以通过手机摇一摇或登录后私信知乎小管家反馈。","code":40362}}"
```

此时就需要通过 自定义请求头来实现

1. 打开浏览器的devtool中network找到第一个请求(ps: 即是"https://zhuanlan.zhihu.com/p/10673225170" 这个请求)
2. 右击Copy -> "Copy as cURL"
3. 黏贴到记事本

```txt
curl 'https://zhuanlan.zhihu.com/p/10673225170' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: zh-CN,zh;q=0.9' \
  -H 'cache-control: no-cache' \
  -H 'cookie: xxx' \
  -H 'pragma: no-cache' \
  -H 'priority: u=0, i' \
  -H 'referer: https://zhuanlan.zhihu.com/p/10673225170' \
  -H 'sec-ch-ua: "Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
```

4. 修改其中内容 `curl`替换 `doc-dl -u`

```txt
doc-dl -u 'https://zhuanlan.zhihu.com/p/10673225170' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: zh-CN,zh;q=0.9' \
  -H 'cache-control: no-cache' \
  -H 'cookie: xxx' \
  -H 'pragma: no-cache' \
  -H 'priority: u=0, i' \
  -H 'referer: https://zhuanlan.zhihu.com/p/10673225170' \
  -H 'sec-ch-ua: "Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
```

5. 最后把 修改后的内容 黏贴到终端运行即可