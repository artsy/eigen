import React from "react"
import { StyleSheet, Text, TextStyle } from "react-native"

export default class SectionTitle extends React.Component<any, any> {
  render() {
    const { children, ...props } = this.props
    return (
      <Text style={styles.headerText} numberOfLines={0} {...props}>
        {children}
      </Text>
    )
  }
}

interface Styles {
  headerText: TextStyle
}

const styles = StyleSheet.create<Styles>({
  headerText: {
    fontFamily: "AGaramondPro-Regular",
    fontSize: 30,
    textAlign: "left",
  },
})
