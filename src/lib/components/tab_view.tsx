import * as React from 'react'
import { StyleSheet, View, ViewProperties, TouchEventHandler } from 'react-native'

import SwitchView from './switch_view'

interface Props extends ViewProperties {
  titles: string[]
  onSelectionChange: TouchEventHandler<SwitchView>
  selectedIndex: number
}

export default class TabView extends React.Component<Props, any> {
  render() {
    const { children, ...props } = this.props
    return (
      <View>
        <SwitchView style={styles.switch}
                    onSelectionChange={this.props.onSelectionChange}
                    titles={this.props.titles}
                    selectedIndex={this.props.selectedIndex} />
        <View>
          {children}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  switch: {
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 0,
    marginRight: 0,
  }
})
