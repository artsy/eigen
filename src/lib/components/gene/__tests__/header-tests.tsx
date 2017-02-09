import { NativeModules } from 'react-native'

import * as React from 'react'
import * as renderer from 'react-test-renderer'

import Header from '../header'
// jest.mock('../../spinner.tsx', () => 'ARSpinner')

beforeAll(() => {
  NativeModules.ARTemporaryAPIModule = { followStatusForGene: jest.fn() }
})

it('renders properly', () => {
  const gene = {
    __id: Math.random(),
    id: 'deep-time',
    name: 'Deep Time'
  }

  const header = renderer.create(<Header gene={gene} />).toJSON()
  expect(header).toMatchSnapshot()
})
