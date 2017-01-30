import React from 'react'
import { requireNativeComponent } from 'react-native'

export default class SwitchView extends React.Component {
  render() {
    const { style, ...props } = this.props
    // Height taken from ARSwitchView.m
    return <NativeSwitchView style={[{ height: 46 }, style]} {...props} />
  }
}

SwitchView.propTypes = {
  titles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  onSelectionChange: React.PropTypes.func.isRequired,
  selectedIndex: React.PropTypes.number,
}

const NativeSwitchView = requireNativeComponent('ARSwitchView', SwitchView)
