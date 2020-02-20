import React from "react"
import { Dimensions, StyleSheet, View, ViewProperties } from "react-native"

import colors from "lib/data/colors"

const negativeMargin = Dimensions.get("window").width > 700 ? -40 : -20

export default class Separator extends React.Component<ViewProperties, any> {
  render() {
    return <View style={[styles.separator, this.props.style]} />
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    marginLeft: negativeMargin,
    marginRight: negativeMargin,
    backgroundColor: colors["gray-regular"],
  },
})
