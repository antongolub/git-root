import { gitDir } from '../../../target/es6'

describe('index (es6)', () => {
  it('exports gitDir fn', () => {
    expect(gitDir).toEqual(expect.any(Function))
  })
})
