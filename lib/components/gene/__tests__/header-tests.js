import { NativeModules } from 'react-native'

import React from 'react'
import renderer from 'react-test-renderer'

import Header from '../header'
jest.mock('../../spinner.js', () => 'ARSpinner')

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
