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
    const imgList = getImgList(mdStr)
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
    const imgList = getImgList(mdStr, transform)
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
    const imgList = getImgList(mdStr)
    expect(imgList.length).toBe(1)
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
  // md中存在相同的图片，还有未匹配图片则原样返回
  it('Images with the same URL', async () => {
    const mdStr = [
      '- ![1.jpg](https://www.baidu.com/1.jpg?123=123#11)',
      '- ![2.jpg](https://www.baidu.com/2.jpg?123=123#22)',
      '- ![](https://www.baidu.com/1222.jpg?123=123#22)',
      '- ![3.jpg](https://www.baidu.com/12.jpg?123=123#33)',
      '- ![2.jpg](https://www.baidu.com/2.jpg?123=123#22)',
      '- ![1.jpg](https://www.baidu.com/1.jpg?123=123#11)'
    ].join('\n')

    const newMd = changeMarkdown(mdStr, [
      '/x/1xxxx.jpg',
      '/x/2xxxx.jpg',
      '/x/3xxxx.jpg'
    ])

    expect(newMd).toBe(
      [
        `- ![1.jpg](./test-img/${Date.now()}/1xxxx.jpg)`,
        `- ![2.jpg](./test-img/${Date.now()}/2xxxx.jpg)`,
        `- ![1222.jpg](./test-img/${Date.now()}/3xxxx.jpg)`,
        '- ![3.jpg](https://www.baidu.com/12.jpg?123=123#33)',
        `- ![2.jpg](./test-img/${Date.now()}/2xxxx.jpg)`,
        `- ![1.jpg](./test-img/${Date.now()}/1xxxx.jpg)`
      ].join('\n')
    )
  })

  it('markdown image without alt, then set default alt', async () => {
    const mdStr = `
    - ![](https://www.baidu.com/1.jpg?123=123#13)
    - ![](https://www.baidu.com/3.jpg)
    - ![2.jpg](https://www.baidu.com/2.jpg?123=123#13)
    - ![(2).jpg](https://www.baidu.com/2.jpg?123=123#13)`

    const newMd = changeMarkdown(mdStr, ['1xxxx.jpg', '3xxxx.jpg', '2xxxx.jpg'])
    expect(newMd).toBe(`
    - ![1.jpg](./test-img/${Date.now()}/1xxxx.jpg)
    - ![3.jpg](./test-img/${Date.now()}/3xxxx.jpg)
    - ![2.jpg](./test-img/${Date.now()}/2xxxx.jpg)
    - ![(2).jpg](./test-img/${Date.now()}/2xxxx.jpg)`)
  })
})

describe('Run', () => {
  const config = {
    dist: `${__dirname}/temp/`,
    imgDir: './img/run_test',
    isIgnoreConsole: true
  } as any

  // afterEach(() => {
  //   resetConfig(config)
  // })

  it('should work', async () => {
    const mdData = `![test](https://localhost/normal.png)`

    const { data } = await run(mdData, config)
    expect(data).toMatch(/!\[test\]\(\.\/img\/run_test\/normal-\d{6}\.png\)/)
  })

  it('content-type suffix test', async () => {
    const mdData = `![test](https://localhost/contentTypeXML)`
    const { data } = await run(mdData, config)
    expect(data).toMatch(
      /!\[test\]\(\.\/img\/run_test\/contentTypeXML-\d{6}\.xml\)/
    )
  })

  it('ignore local img', async () => {
    const mdData = `![](./test.png)`
    const { data } = await run(mdData, config)
    expect(data).toBe(mdData)
  })

  it('mkdir img Special symbols', async () => {
    const mdData = `![test](https://localhost/normal.png)`
    const { data } = await run(mdData, {
      dist: 'test/temp/',
      imgDir: './img/11:22*33?44"55<66>77|88\r\n999',
      isIgnoreConsole: true
    })

    expect(data).toMatch(
      /!\[test\]\(\.\/img\/11_22_33_44_55_66_77_88__999\/normal-\d{6}\.png\)/
    )
  })

  // 后缀名以content-type优先
  it('Suffix names prioritize content-type', async () => {
    const mdData = `![test](https://localhost/prioritizeContentType.awebp)`
    let data = ''
    try {
      const res = await run(mdData, config)
      data = res.data
    } catch (e) {
      console.log(e)
      // throw e
    }
    expect(data).toMatch(
      /!\[test\]\(\.\/img\/run_test\/prioritizeContentType-\d{6}\.webp\)/
    )
  })
  // 后缀名以content-type优先 jpg类型需识别为 jpeg
  it('The suffix jpg needs to be recognized as jpeg', async () => {
    const mdData = `![test](https://localhost/jpgContentType)`
    let data = ''
    try {
      const res = await run(mdData, config)
      data = res.data
    } catch (e) {
      data = `error ${e.message}`
      // throw e
    }
    expect(data).toMatch(
      /!\[test\]\(\.\/img\/run_test\/jpgContentType-\d{6}\.jpeg\)/
    )
  })

  it('normal referer', async () => {
    const mdStr = `
    - ![2.jpg](https://localhost/referer)
    `
    const matchReg = /!\[(.*?)\]\((.*?)\)/gm
    const { data } = await run(mdStr, config)
    expect(data).toMatch(/!\[2.jpg\]\(\.\/img\/run_test\/referer-\d{6}\.txt\)/)
    const execData = matchReg.exec(data) || []
    const filePath = path.resolve(`${__dirname}/temp/`, execData[2])
    const fileData = await fs.readFile(filePath)
    expect(fileData.toString()).toBe('https://localhost/referer')
  })

  it('custom referer', async () => {
    const mdStr = `
    - ![2.jpg](https://localhost/referer)
    `
    const matchReg = /!\[(.*?)\]\((.*?)\)/gm
    config.referer = 'https://www.yuque.com'
    const { data } = await run(mdStr, config)
    expect(data).toMatch(/!\[2.jpg\]\(\.\/img\/run_test\/referer-\d{6}\.txt\)/)
    const execData = matchReg.exec(data) || []
    const filePath = path.resolve(`${__dirname}/temp/`, execData[2])
    const fileData = await fs.readFile(filePath)
    expect(fileData.toString()).toBe(config.referer)
  })

  // 图片名称太长仅保留100个字符
  it('img name too long', async () => {
    const mdData = `![test](https://localhost/longName_${'1'.repeat(280)})`
    const { data } = await run(mdData, config)
    expect(data).toMatch(
      /!\[test\]\(\.\/img\/run_test\/longName_1{91}-\d{6}\.txt\)/
    )
  })

  // 相同的图片只下载一张
  it('Download the same image only once', async () => {
    const mdStr = `![1](https://localhost/normal.png)\n![2](https://localhost/normal.png)`

    const { data } = await run(mdStr, config)
    expect(data).toMatch(
      /!\[1\]\((\.\/img\/run_test\/normal-\d{6}\.png)\)\n!\[2\]\(\1\)/gm
    )
  })

  it('local image ignore', async () => {
    const mdStr = `
      ![1](https://localhost/normal.png)
      ![3](/xx/404.png)
      ![2](https://localhost/normal.png)`
    const { data } = await run(mdStr, config)
    const reg = new RegExp(
      `
      !\\[1\\]\\((\\./img/run_test/normal-\\d{6}\\.png)\\)
      !\\[3\\]\\(/xx/404.png\\)
      !\\[2\\]\\(\\1\\)`,
      'gm'
    )
    expect(data).toMatch(reg)
  })

  it('error image', async () => {
    const mdStr = `
    ![1](https://localhost/normal.png)
    ![3](https://localhost/404)
    ![2](https://localhost/normal.png)`
    let fail = false
    try {
      await run(mdStr, config)
    } catch (e) {
      fail = true
      expect(e.error.message).toBe('Error Status Code: 404')
    }
    expect(fail).toBe(true)
  })

  it('ignore error still return', async () => {
    const mdStr = `
      ![1](https://localhost/normal.png)
      ![3](https://localhost/404)
      ![2](https://localhost/prioritizeContentType.awebp)
      ![2](https://localhost/normal.png)`

    const { data, errorInfo } = await run(mdStr, {
      ...config,
      errorStillReturn: true
    })
    expect(errorInfo[0].error.message).toBe('Error Status Code: 404')
    expect(errorInfo[0].url).toBe('https://localhost/404')
    const reg = new RegExp(
      `
      !\\[1\\]\\((\\./img/run_test/normal-\\d{6}\\.png)\\)
      !\\[3\\]\\(https://localhost/404\\)
      !\\[2\\]\\(\\./img/run_test/prioritizeContentType-\\d{6}.webp\\)
      !\\[2\\]\\(\\1\\)`,
      'gm'
    )
    expect(data).toMatch(reg)
  })

  it('custom transform', async () => {
    const mdStr = `![](https://localhost/normal.png)`
    const matchReg = /!\[(.*?)\]\((.*?)\)/gm
    matchReg.lastIndex = 0
    config.transform = (url) => {
      return url === 'https://localhost/normal.png'
        ? 'https://localhost/prioritizeContentType.awebp'
        : url
    }
    const { data } = await run(mdStr, config)
    const execData = matchReg.exec(data) || []
    const filePath = path.resolve(`${__dirname}/temp/`, execData[2])
    const fileData = await fs.readFile(filePath)
    // 24774
    expect(fileData.toString()).toBe('awebp Data')
  })

  // it('code block has markdown image', async () => {
  //   const mdStr = `
  //   - ![1.jpg](./img/1.jpg)
  //   \`\`\`
  //   - ![(2).jpg](https://www.baidu.com/2.jpg)
  //   \`\`\`
  //   `
  //   const imgList = getImgList(mdStr)
  //   console.log(imgList)
  //   expect(imgList.length).toBe(1)
  //   expect(imgList[0]).toBe('https://www.baidu.com/2.jpg')
  // })
})
