import { gitRoot } from '../../../target/es6'

describe('index (es6)', () => {
  it('exports gitRoot fn', () => {
    expect(gitRoot).toEqual(expect.any(Function))
  })
})

