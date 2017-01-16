import 'react-native'

import React from 'react'
import renderer from 'react-test-renderer'

import InvertedButton from '../inverted_button'

it('renders properly', () => {
  const button = renderer.create(<InvertedButton text={'I am an inverted button'}/>).toJSON()
  expect(button).toMatchSnapshot()
})
