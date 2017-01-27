import 'react-native'

import React from 'react'
import renderer from 'react-test-renderer'

import WhiteButton from '../flat_white'

it('renders properly', () => {
  const button = renderer.create(<WhiteButton selected={true} text={'I am a button'}/>).toJSON()
  expect(button).toMatchSnapshot()
})
