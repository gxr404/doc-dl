import { describe, expect, it, vi } from 'vitest'
import { changeMarkdown, getImgList, run } from '../src/index'

vi.mock('../src/config', () => {
  const date = new Date(2000, 1, 1, 0, 0, 0)
  vi.setSystemTime(date)
  return {
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
  // 图片在列表中唯一
  it('Unique images in the list', async () => {
    const mdStr = `
    - ![1.jpg](https://www.baidu.com/2.jpg)
    - ![2.jpg](https://www.baidu.com/2.jpg)
    `
    const imgList = await getImgList(mdStr)
    expect(imgList.length).toBe(1)
    expect(imgList[0]).toBe('https://www.baidu.com/2.jpg')
  })
  // 图片url移除search和hash
  it('image url remove search and hash', async () => {
    const mdStr = `
    - ![1.jpg](https://www.baidu.com/2.jpg?123=123#13)
    `
    const imgList = await getImgList(mdStr)
    expect(imgList.length).toBe(1)
    expect(imgList[0]).toBe('https://www.baidu.com/2.jpg')
  })
})

// 根据图片列表更改markdown中的图片
describe('Change markdown based on image list', () => {
  it('normal', async () => {
    const mdStr = `- ![1.jpg](https://www.baidu.com/1.jpg?123=123#13)\n- ![2.jpg](https://www.baidu.com/2.jpg?123=123#13)`

    const newMd = changeMarkdown(mdStr, ['1xxxx.jpg', '2xxxx.jpg'])
    expect(newMd).toBe(
      `- ![1.jpg](./test-img/949334400000/1xxxx.jpg)\n- ![2.jpg](./test-img/949334400000/2xxxx.jpg)`
    )
  })
  // 相同url的图片 用相同的本地文件
  it('Images with the same URL', async () => {
    const mdStr = [
      '- ![1.jpg](https://www.baidu.com/1.jpg?123=123#11)',
      '- ![2.jpg](https://www.baidu.com/2.jpg?123=123#22)',
      '- ![1.jpg](https://www.baidu.com/1.jpg?123=123#11)',
      '- ![3.jpg](https://www.baidu.com/12.jpg?123=123#33)',
      '- ![2.jpg](https://www.baidu.com/2.jpg?123=123#22)',
      '- ![1.jpg](https://www.baidu.com/1.jpg?123=123#11)'
    ].join('\n')

    const newMd = changeMarkdown(mdStr, ['1xxxx.jpg', '2xxxx.jpg', '3xxxx.jpg'])

    expect(newMd).toBe(
      [
        '- ![1.jpg](./test-img/949334400000/1xxxx.jpg)',
        '- ![2.jpg](./test-img/949334400000/2xxxx.jpg)',
        '- ![1.jpg](./test-img/949334400000/1xxxx.jpg)',
        '- ![3.jpg](./test-img/949334400000/3xxxx.jpg)',
        '- ![2.jpg](./test-img/949334400000/2xxxx.jpg)',
        '- ![1.jpg](./test-img/949334400000/1xxxx.jpg)'
      ].join('\n')
    )
  })
})

describe('Run', () => {
  const config = {
    dist: `${__dirname}/dist/`,
    imgDir: './img/run_test',
    isIgnoreConsole: true
  }

  it('normal', async () => {
    const mdData = `![](https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png)`

    const newMdData = await run(mdData, config)
    expect(newMdData).toMatch(
      /!\[\]\(\.\/img\/run_test\/PCfb_5bf082d29588c07f842ccde3f97243ea-\d{6}\.png\)/
    )
  })

  it('content-type suffix test', async () => {
    const mdData = `![](https://mmbiz.qpic.cn/mmbiz_png/2esNbY6p4sZrUzvXjmsXNsLIEiaUDznZiaF3qkkcWeSxAbm8cPEHN8rszoadUDFYyWYdHIIHGI0C4aPntRw07pBg/640)`
    const data = await run(mdData, config)
    expect(data).toMatch(/!\[\]\(\.\/img\/run_test\/640-\d{6}\.png\)/)
  })

  it('ignore local img', async () => {
    const mdData = `![](./test.png)`
    const data = await run(mdData, config)
    expect(data).toBe(mdData)
  })

  it('mkdir img Special symbols', async () => {
    const mdData = `![](https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png)`
    const data = await run(mdData, {
      dist: 'test/dist/',
      imgDir: './img/11:22*33?44"55<66>77|88\r\n999',
      isIgnoreConsole: true
    })

    expect(data).toMatch(
      /!\[\]\(\.\/img\/11_22_33_44_55_66_77_88__999\/PCfb_5bf082d29588c07f842ccde3f97243ea-\d{6}\.png\)/
    )
  })
})
