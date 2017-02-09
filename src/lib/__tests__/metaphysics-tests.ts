import metaphysics from '../metaphysics'

jest.mock('../metaphysics.ts')
console.dir(metaphysics)

describe('metaphysics', () => {
  it('should return the mocked module', () => {
    expect(metaphysics.isMocked).toBeTruthy()
  })
})