import { createRequire } from 'node:module'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import { expect } from 'earljs'
import { suite } from 'uvu'

import { gitRoot } from '@antongolub/git-root'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const describe = (name, cb) => { const test = suite(name); cb(test); test.run() }
const root = path.resolve(__dirname, '../../..')

describe('index (es6)', (it) => {
  it('exports gitRoot fn', () => {
    expect(gitRoot(undefined, true)).toEqual(root)
  })
})

describe('bundle', (it) => {
  it('exports gitRoot fn', () => {
    const fn = require('../../../target/bundle/git-root.cjs').gitRoot  // eslint-disable-line

    expect(fn(undefined, true)).toEqual(root)
  })
})
