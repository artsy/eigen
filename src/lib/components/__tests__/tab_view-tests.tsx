import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('../../components/switch_view', () => 'SwitchView')
import TabView from '../tab_view'

it('looks like expected', () => {
  const tree = renderer.create(
    <TabView titles={['one', 'two']} selectedIndex={1} onSelectionChange={() => {}} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
