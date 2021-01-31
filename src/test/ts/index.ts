import fs from 'fs-extra'
import path from 'path'
import tempy from 'tempy'

import { gitDir } from '../../main/ts'

describe('gitDir', () => {
  it('handles `gitdir: ref` and returns target path if exists', async () => {
    const temp0 = tempy.directory()
    const temp1 = tempy.directory()
    const data = `gitdir: ${temp1}.git `

    await fs.outputFile(path.join(temp0, '.git'), data, {
      encoding: 'utf8',
    })

    expect(await gitDir(temp0)).toBe(temp1)
    expect(gitDir.sync(temp0)).toBe(temp1)
  })

  it('returns undefined if `gitdir: ref` is unreachable', async () => {
    const temp = tempy.directory()
    const data = `gitdir: /foo/bar/baz.git `

    await fs.outputFile(path.join(temp, '.git'), data, { encoding: 'utf8' })

    expect(await gitDir(temp)).toBeUndefined()
    expect(gitDir.sync(temp)).toBeUndefined()
  })

  it('returns undefined if `gitdir: ref` is invalid', async () => {
    const temp = tempy.directory()
    const data = `gitdir: broken-ref-format`

    await fs.outputFile(path.join(temp, '.git'), data, { encoding: 'utf8' })

    expect(await gitDir(temp)).toBeUndefined()
    expect(gitDir.sync(temp)).toBeUndefined()
  })
})
