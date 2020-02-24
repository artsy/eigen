import React from "react"
import { StyleSheet, View, ViewProperties } from "react-native"

import SwitchView, { SwitchEvent } from "./SwitchView"

interface Props extends ViewProperties {
  titles: string[]
  onSelectionChange: (event: SwitchEvent) => void
  selectedIndex: number
}

export default class TabView extends React.Component<Props, any> {
  render() {
    const { children } = this.props
    return (
      <View>
        <SwitchView
          style={styles.switch}
          onSelectionChange={this.props.onSelectionChange}
          titles={this.props.titles}
          selectedIndex={this.props.selectedIndex}
        />
        <View>{children}</View>
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
  },
})
