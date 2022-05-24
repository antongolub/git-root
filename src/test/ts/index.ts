import fs from 'fs-extra'
import path from 'path'
import { temporaryDirectory } from 'tempy'

import def, { gitRoot, gitRootSync } from '../../main/ts'

describe('gitRoot', () => {
  it('returns .git root', async () => {
    const temp = temporaryDirectory()
    const inner = path.resolve(temp, 'foo/bar/baz')

    fs.mkdirpSync(inner)
    fs.mkdirpSync(path.resolve(temp, '.git'))

    expect(await gitRoot(inner)).toBe(temp)
    expect(gitRootSync(inner)).toBe(temp)
  })

  it('handles `gitdir: ref` and returns target path if exists', async () => {
    const temp0 = temporaryDirectory()
    const temp1 = temporaryDirectory()
    const data = `gitdir: ${temp1}.git `

    await fs.outputFile(path.join(temp0, '.git'), data, {
      encoding: 'utf8',
    })

    expect(await gitRoot(temp0)).toBe(temp1)
    expect(gitRoot.sync(temp0)).toBe(temp1)
  })

  it('returns undefined if `gitdir: ref` is unreachable', async () => {
    const temp = temporaryDirectory()
    const data = `gitdir: /foo/bar/baz.git `

    await fs.outputFile(path.join(temp, '.git'), data, { encoding: 'utf8' })

    expect(await gitRoot(temp)).toBeUndefined()
    expect(gitRoot.sync(temp)).toBeUndefined()
  })

  it('returns undefined if `gitdir: ref` is invalid', async () => {
    const temp = temporaryDirectory()
    const data = `gitdir: broken-ref-format`

    await fs.outputFile(path.join(temp, '.git'), data, { encoding: 'utf8' })

    expect(await gitRoot(temp)).toBeUndefined()
    expect(gitRoot.sync(temp)).toBeUndefined()
  })

  it('`gitRoot.sync` refers to `gitRootSync`', () => {
    expect(gitRootSync).toBe(gitRoot.sync)
  })

  it('default export refers to `gitRoot`', () => {
    expect(def).toBe(gitRoot)
  })
})
