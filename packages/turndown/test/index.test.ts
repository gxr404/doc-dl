import fs from 'node:fs/promises'
import path from 'node:path'
import { it, expect } from 'vitest'
import TurndownService from 'turndown'

import getPlugins from '../src/index'

const service = new TurndownService()
service.use(
  getPlugins({
    articleUrl: 'http://www.test.com'
  })
)

const fixturesFolder = path.join(__dirname, './fixtures')

const whiteList: string[] = []
const blackList: string[] = []

it('test turndown plugins', async () => {
  const fixtures = await fs.readdir(fixturesFolder)
  for (const fixture of fixtures) {
    if (blackList.includes(fixture)) {
      continue
    }
    const fixturesFolderPath = path.join(`${fixturesFolder}/${fixture}`)
    const file = await fs.readFile(
      path.join(fixturesFolderPath, 'index.html'),
      'utf-8'
    )
    let expectResult = await fs.readFile(
      path.join(fixturesFolderPath, 'expect.md'),
      'utf-8'
    )
    if (whiteList.includes(fixture)) {
      await fs.writeFile(
        path.join(fixturesFolderPath, 'expect.md'),
        service.turndown(file)
      )
      expectResult = await fs.readFile(
        path.join(fixturesFolderPath, 'expect.md'),
        'utf-8'
      )
    }
    expect(service.turndown(file)).toEqual(expectResult)
  }
})
