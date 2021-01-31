import { gitRoot } from '../../../target/es6'

describe('index (es6)', () => {
  it('exports gitRoot fn', () => {
    expect(gitRoot).toEqual(expect.any(Function))
  })
})

describe('bundle', () => {
  it('exports gitRoot fn', () => {
    expect(require('../../../target/bundle/git-root').gitRoot).toEqual(expect.any(Function)) // eslint-disable-line
  })
})
