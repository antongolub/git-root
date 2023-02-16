import path from 'node:path'

import { expect } from 'earljs'
import fs from 'fs-extra'
import { temporaryDirectory } from 'tempy'
import { suite, Test } from 'uvu'

import def, { gitRoot, gitRootSync } from '../../main/ts/index.js'

const describe = (name: string, cb: (it: Test) => void) => {
  const test = suite(name)
  cb(test)
  test.run()
}

describe('gitRoot', (it) => {
  it('returns .git root', async () => {
    const temp = temporaryDirectory()
    const inner = path.resolve(temp, 'foo/bar/baz')

    fs.mkdirpSync(inner)
    fs.mkdirpSync(path.resolve(temp, '.git'))

    expect(await gitRoot(inner)).toEqual(temp)
    expect(gitRootSync(inner)).toEqual(temp)
  })

  it('returns undefined if path is unreachable', async () => {
    const temp = temporaryDirectory()
    const target = path.resolve(temp, 'foo/bar/baz')

    expect(await gitRoot(target)).not.toBeDefined()
    expect(gitRootSync(target)).not.toBeDefined()
  })

  it('handles `gitdir: ref` and returns target path if exists', async () => {
    const temp0 = temporaryDirectory()
    const temp1 = temporaryDirectory()
    const data = `gitdir: ${temp1}.git `

    await fs.mkdir(path.join(temp1, '.git'))
    await fs.outputFile(path.join(temp0, '.git'), data, {
      encoding: 'utf8',
    })

    expect(await gitRoot(temp0)).toEqual(temp1)
    expect(gitRoot.sync(temp0)).toEqual(temp1)
  })

  it('returns undefined if `gitdir: ref` is unreachable', async () => {
    const temp = temporaryDirectory()
    const data = `gitdir: /foo/bar/baz.git `

    await fs.outputFile(path.join(temp, '.git'), data, { encoding: 'utf8' })

    expect(await gitRoot(temp)).not.toBeDefined()
    expect(gitRoot.sync(temp)).not.toBeDefined()
  })

  it('returns undefined if `gitdir: ref` is invalid', async () => {
    const temp = temporaryDirectory()
    const data = `gitdir: broken-ref-format`

    await fs.outputFile(path.join(temp, '.git'), data, { encoding: 'utf8' })

    expect(await gitRoot(temp)).not.toBeDefined()
    expect(gitRoot.sync(temp)).not.toBeDefined()
  })

  it('`gitRoot.sync` refers to `gitRootSync`', () => {
    expect(gitRootSync).toEqual(gitRoot.sync)
  })

  it('default export refers to `gitRoot`', () => {
    expect(def).toEqual(gitRoot)
  })
})
