import * as React from 'react'
import { requireNativeComponent, ViewProperties, TouchEventHandler } from 'react-native'

interface Props extends ViewProperties {
  titles: string[]
  onSelectionChange: TouchEventHandler<SwitchView>
  selectedIndex: number
}

export default class SwitchView extends React.Component<Props, {}> {
  static propTypes = {
    titles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onSelectionChange: React.PropTypes.func.isRequired,
    selectedIndex: React.PropTypes.number,
  }

  render() {
    const { style, ...props } = this.props
    // Height taken from ARSwitchView.m
    return <NativeSwitchView style={[{ height: 46 }, style]} {...props} />
  }
}

const NativeSwitchView: React.ComponentClass<any> = requireNativeComponent('ARSwitchView', SwitchView)
