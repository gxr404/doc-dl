const { run } = require('../dist/index.js')

const config = {
  dist: 'test/dist/',
  imgDir: './img/run_test',
  isIgnoreConsole: true
}
test('run test', () => {
  const mdData = `![](https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png)`

  return run(mdData, config).then((data) => {
    expect(data).toMatch(
      /\!\[\]\(\.\/img\/run_test\/PCfb_5bf082d29588c07f842ccde3f97243ea-\d{6}\.png\)/
    )
  })
})

test('run content-type suffix test', () => {
  const mdData = `![](https://mmbiz.qpic.cn/mmbiz_png/2esNbY6p4sZrUzvXjmsXNsLIEiaUDznZiaF3qkkcWeSxAbm8cPEHN8rszoadUDFYyWYdHIIHGI0C4aPntRw07pBg/640)`

  return run(mdData, config).then((data) => {
    expect(data).toMatch(/\!\[\]\(\.\/img\/run_test\/640-\d{6}\.png\)/)
  })
})

test('ignore local img', () => {
  const mdData = `![](./test.png)`
  return run(mdData, config).then((data) => {
    expect(data).toBe(mdData)
  })
})

test('mkdir img Special symbols', () => {
  const mdData = `![](https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png)`
  return run(mdData, {
    dist: 'test/dist/',
    imgDir: './img/11:22*33?44"55<66>77|88\r\n999',
    isIgnoreConsole: true
  }).then((data) => {
    expect(data).toMatch(
      /\!\[\]\(\.\/img\/11_22_33_44_55_66_77_88__999\/PCfb_5bf082d29588c07f842ccde3f97243ea-\d{6}\.png\)/
    )
  })
})
