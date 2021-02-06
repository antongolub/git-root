import path from 'path'

import { gitRoot } from '../../../target/es6'

const root = path.resolve(__dirname, '../../..')

describe('index (es6)', () => {
  it('exports gitRoot fn', () => {
    expect(gitRoot(undefined, true)).toBe(root)
  })
})

describe('bundle', () => {
  it('exports gitRoot fn', () => {
    const fn = require('../../../target/bundle/git-root').gitRoot  // eslint-disable-line

    expect(fn(undefined, true)).toBe(root)

  })
})
