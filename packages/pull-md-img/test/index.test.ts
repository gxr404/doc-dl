import fs from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { changeMarkdown, getImgList, run } from '../src/index'

vi.mock('../src/config', async (importOriginal) => {
  const date = new Date(Date.UTC(2000, 0))
  vi.setSystemTime(date)
  const mod = await importOriginal<typeof import('../src/config')>()
  return {
    ...mod,
    default: {
      path: 'test',
      suffix: '',
      dist: './res/',
      imgDir: `./test-img/${Date.now()}`,
      // markdown img 正则 注意多行匹配
      mdImgReg: /!\[(.*?)\]\((.*?)\)/gm,
      isIgnoreConsole: true
    },
    namedExport: vi.fn()
  }
})

// 获取markdown中的图片列表
describe('get markdown img list', () => {
  // 只获取远程图片
  it('Only get remote image list', async () => {
    const mdStr = `
    - ![1.jpg](./img/1.jpg)
    - ![2.jpg](https://www.baidu.com/2.jpg)
    `
    const imgList = await getImgList(mdStr)
    expect(imgList.length).toBe(1)
    expect(imgList[0]).toBe('https://www.baidu.com/2.jpg')
  })

  it('custom transform', async () => {
    const mdStr = `
    - ![1.jpg](./img/1.jpg)
    - ![2.jpg](https://www.baidu.com/2.jpg)
    - ![3.jpg](https://www.baidu.com/3.jpg)
    `
    function transform(url) {
      return url === 'https://www.baidu.com/2.jpg'
        ? 'https://www.baidu.com/3.jpg'
        : url
    }
    const imgList = await getImgList(mdStr, transform)
    expect(imgList.length).toBe(2)
    expect(imgList[0]).toBe('https://www.baidu.com/3.jpg')
    expect(imgList[1]).toBe('https://www.baidu.com/3.jpg')
  })

  // 图片在列表中唯一
  it('Unique images in the list', async () => {
    const mdStr = `
    - ![1.jpg](https://www.baidu.com/2.jpg)
    - ![2.jpg](https://www.baidu.com/2.jpg)
    `
    const imgList = await getImgList(mdStr)
    expect(imgList.length).toBe(2)
    expect(imgList[0]).toBe('https://www.baidu.com/2.jpg')
  })
  // // 图片url移除search和hash
  // it('image url remove search and hash', async () => {
  //   const mdStr = `
  //   - ![1.jpg](https://www.baidu.com/2.jpg?123=123#13)
  //   `
  //   const imgList = await getImgList(mdStr)
  //   expect(imgList.length).toBe(1)
  //   expect(imgList[0]).toBe('https://www.baidu.com/2.jpg')
  // })
})

// 根据图片列表更改markdown中的图片
describe('Change markdown based on image list', () => {
  it('normal', async () => {
    const mdStr = `- ![1.jpg](https://www.baidu.com/1.jpg?123=123#13)\n- ![2.jpg](https://www.baidu.com/2.jpg?123=123#13)`

    const newMd = changeMarkdown(mdStr, ['1xxxx.jpg', '2xxxx.jpg'])
    expect(newMd).toBe(
      `- ![1.jpg](./test-img/${Date.now()}/1xxxx.jpg)\n- ![2.jpg](./test-img/${Date.now()}/2xxxx.jpg)`
    )
  })
  // md中的图片需跟提供的图片列表一样多
  it('Images with the same URL', async () => {
    const mdStr = [
      '- ![1.jpg](https://www.baidu.com/1.jpg?123=123#11)',
      '- ![2.jpg](https://www.baidu.com/2.jpg?123=123#22)',
      '- ![](https://www.baidu.com/1222.jpg?123=123#22)',
      '- ![3.jpg](https://www.baidu.com/12.jpg?123=123#33)',
      '- ![2.jpg](https://www.baidu.com/2.jpg?123=123#22)',
      '- ![1.jpg](https://www.baidu.com/1.jpg?123=123#11)'
    ].join('\n')

    const newMd = changeMarkdown(mdStr, ['1xxxx.jpg', '2xxxx.jpg', '3xxxx.jpg'])

    expect(newMd).toBe(
      [
        `- ![1.jpg](./test-img/${Date.now()}/1xxxx.jpg)`,
        `- ![2.jpg](./test-img/${Date.now()}/2xxxx.jpg)`,
        `- ![1222.jpg](./test-img/${Date.now()}/3xxxx.jpg)`,
        `- ![3.jpg](undefined)`,
        `- ![2.jpg](undefined)`,
        `- ![1.jpg](undefined)`
      ].join('\n')
    )
  })

  it('markdown image without alt, then set default alt', async () => {
    const mdStr = `- ![](https://www.baidu.com/1.jpg?123=123#13)\n- ![2.jpg](https://www.baidu.com/2.jpg?123=123#13)`
    const newMd = changeMarkdown(mdStr, ['1xxxx.jpg', '2xxxx.jpg'])
    expect(newMd).toBe(
      `- ![1.jpg](./test-img/${Date.now()}/1xxxx.jpg)\n- ![2.jpg](./test-img/${Date.now()}/2xxxx.jpg)`
    )
  })
})

describe('Run', () => {
  const config = {
    dist: `${__dirname}/temp/`,
    imgDir: './img/run_test',
    isIgnoreConsole: true
  }

  it('normal', async () => {
    const mdData = `![test](https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png)`

    const newMdData = await run(mdData, config)
    expect(newMdData).toMatch(
      /!\[test\]\(\.\/img\/run_test\/PCfb_5bf082d29588c07f842ccde3f97243ea-\d{6}\.png\)/
    )
  })

  it('content-type suffix test', async () => {
    const mdData = `![test](https://mmbiz.qpic.cn/mmbiz_png/2esNbY6p4sZrUzvXjmsXNsLIEiaUDznZiaF3qkkcWeSxAbm8cPEHN8rszoadUDFYyWYdHIIHGI0C4aPntRw07pBg/640)`
    const data = await run(mdData, config)
    expect(data).toMatch(/!\[test\]\(\.\/img\/run_test\/640-\d{6}\.png\)/)
  })

  it('ignore local img', async () => {
    const mdData = `![](./test.png)`
    const data = await run(mdData, config)
    expect(data).toBe(mdData)
  })

  it('mkdir img Special symbols', async () => {
    const mdData = `![test](https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png)`
    const data = await run(mdData, {
      dist: 'test/temp/',
      imgDir: './img/11:22*33?44"55<66>77|88\r\n999',
      isIgnoreConsole: true
    })

    expect(data).toMatch(
      /!\[test\]\(\.\/img\/11_22_33_44_55_66_77_88__999\/PCfb_5bf082d29588c07f842ccde3f97243ea-\d{6}\.png\)/
    )
  })
  // 后缀名以content-type优先
  it('Suffix names prioritize content-type', async () => {
    const mdData = `![test](https://p6-passport.byteacctimg.com/img/user-avatar/eda8490a0609d437f24c116bf72df379~200x200.awebp)`

    const newMdData = await run(mdData, config)
    expect(newMdData).toMatch(
      /!\[test\]\(\.\/img\/run_test\/eda8490a0609d437f24c116bf72df379_200x200-\d{6}\.webp\)/
    )
  })
  // 后缀名以content-type优先 jpg类型需识别为 jpeg
  it('Suffix names prioritize content-type', async () => {
    const mdData = `![test](http://www.xzclass.com/img.php?img=https://mmbiz.qpic.cn/sz_mmbiz_png/pUm6Hxkd434kficgNzJa7NqvNOg406ol3iajYjgeh12Q61pLtt3x2xZ8c2xJx5U8tViczPdvRvdI5xmlMbavtKFPw/640?wx_fmt=png)`
    const newMdData = await run(mdData, config)
    expect(newMdData).toMatch(/!\[test\]\(\.\/img\/run_test\/img-\d{6}\.jpeg\)/)
  })

  // 图片名称太长仅保留100个字符
  it('img name too long', async () => {
    const mdData =
      '![test](https://gxr404.github.io/gxr_test/11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111.jpg)'
    const newMdData = await run(mdData, config)
    expect(newMdData).toMatch(
      /!\[test\]\(\.\/img\/run_test\/1{100}-\d{6}\.jpeg\)/
    )
  })
})

// 获取markdown中的图片列表
describe('header referer', () => {
  const config = {
    dist: `${__dirname}/temp/`,
    imgDir: './img/run_test',
    isIgnoreConsole: true
  } as any
  const mdStr = `
    - ![2.jpg](https://www.yuque.com/api/filetransfer/images?url=http%3A%2F%2Fglorious.icu%2Fsky-take-out%2Fimage-20221106200821282.png&sign=810804669a4d7f1c82b4006d6e190d885c11cc6ed7e06926964f492439142b94)
    `

  const matchReg = /!\[(.*?)\]\((.*?)\)/gm

  it('normal referer', async () => {
    matchReg.lastIndex = 0
    const res = await run(mdStr, config)
    expect(res).toMatch(
      /!\[2.jpg\]\(\.\/img\/run_test\/1699244722672-9fcdc40e-f8f5-4d34-973a-952bf53676b3-\d{6}\.png\)/
    )
    const data = matchReg.exec(res) || []
    const filePath = path.resolve(`${__dirname}/temp/`, data[2])
    const fileData = await fs.readFile(filePath)
    expect(fileData.length).toBe(17192)
  })

  it('custom referer', async () => {
    matchReg.lastIndex = 0
    config.referer = 'https://www.yuque.com'
    const res = await run(mdStr, config)
    expect(res).toMatch(
      /!\[2.jpg\]\(\.\/img\/run_test\/1699244722672-9fcdc40e-f8f5-4d34-973a-952bf53676b3-\d{6}\.png\)/
    )
    const data = matchReg.exec(res) || []
    const filePath = path.resolve(`${__dirname}/temp/`, data[2])
    const fileData = await fs.readFile(filePath)
    expect(fileData.length).toBe(17192)
  })
})

// 图片转换函数
describe('transform', () => {
  const config = {
    dist: `${__dirname}/temp/`,
    imgDir: './img/run_test',
    isIgnoreConsole: true
  } as any
  const mdStr = `![](https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png)`
  const matchReg = /!\[(.*?)\]\((.*?)\)/gm

  it('custom transform', async () => {
    matchReg.lastIndex = 0
    config.transform = (url) => {
      return url ===
        'https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png'
        ? 'https://news-bos.cdn.bcebos.com/mvideo/log-news.png'
        : url
    }
    const res = await run(mdStr, config)
    const data = matchReg.exec(res) || []
    const filePath = path.resolve(`${__dirname}/temp/`, data[2])
    const fileData = await fs.readFile(filePath)
    // 24774
    expect(fileData.length).toBe(88360)
  })
})

// 相同的图片只下载一张
describe('same image', () => {
  const config = {
    dist: `${__dirname}/temp/`,
    imgDir: './img/run_test',
    isIgnoreConsole: true
  } as any
  const mdStr = `![1](https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png)\n![2](https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png)`

  it('Download the same image only once', async () => {
    const res = await run(mdStr, config)
    expect(res).toMatch(
      /!\[1\]\((\.\/img\/run_test\/PCfb_5bf082d29588c07f842ccde3f97243ea-\d{6}\.png)\)\n!\[2\]\(\1\)/gm
    )
  })
})
