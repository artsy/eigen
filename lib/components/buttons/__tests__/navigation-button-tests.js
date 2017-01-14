import 'react-native'

import React from 'react'
import renderer from 'react-test-renderer'

import NavigationButton from '../navigation_button'

it('renders properly', () => {
  const button = renderer.create(<NavigationButton title={'I am a navigation button'} />).toJSON()
  expect(button).toMatchSnapshot()
})
