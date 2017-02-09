import 'react-native'

import * as React from 'react'
import * as renderer from 'react-test-renderer'

import InvertedButton from '../inverted_button'
// jest.mock('../../spinner.tsx', () => 'ARSpinner')

it('renders properly', () => {
  const button = renderer.create(<InvertedButton text={'I am an inverted button'}/>).toJSON()
  expect(button).toMatchSnapshot()
})
