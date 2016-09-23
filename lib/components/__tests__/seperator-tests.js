import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import Separator from '../separator'

it('looks like expected', () => {
  const tree = renderer.create(
    <Separator />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})


