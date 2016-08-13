import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import TabView from '../../lib/components/tab_view'

function createMockComponent(componentName: String) {
  return React.createClass({
    render: function() {
      return React.createElement(componentName, this.props)
    }
  })
}


it('looks like expected', () => {
  createMockComponent('ARSwitchView')

  const tree = renderer.create(
    <TabView titles={['one', 'two']} selectedIndex={1} onSelectionChange={() => {}} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
