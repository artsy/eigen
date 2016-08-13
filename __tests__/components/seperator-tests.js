import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import Seperator from '../../lib/components/separator'

it('looks like expected', () => {
  const tree = renderer.create(
    <Seperator />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
