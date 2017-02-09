jest.mock('../metaphysics.ts')

import metaphysics from '../metaphysics'

describe('metaphysics', () => {
  it('should return the mocked module', () => {
    expect(metaphysics.isMocked).toBeTruthy()
  })
})