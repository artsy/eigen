import React from "react"
import { StyleSheet, Text, TextProperties, TextStyle } from "react-native"

import colors from "lib/data/colors"
import fonts from "lib/data/fonts"

const LargeHeadline: React.SFC<TextProperties> = props => {
  const children: string = (props as any).children
  const style = [styles.largeHeadlineDefault, props.style || {}, styles.largeHeadlineRequired]
  return (
    <Text key={children} style={style}>
      {props.children}
    </Text>
  )
}

const SmallHeadline: React.SFC<TextProperties> = (props: TextProperties) => {
  const children: string = (props as any).children
  const style = [styles.smallHeadlineDefault, props.style || {}, styles.smallHeadlineRequired]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

const Subtitle: React.SFC<TextProperties> = (props: TextProperties) => {
  const children: string = (props as any).children
  const style = [styles.subtitleDefault, props.style || {}, styles.subtitleRequired]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

const BodyText: React.SFC<TextProperties> = (props: TextProperties) => {
  const children: string = (props as any).children
  const style = [styles.bodyDefault, props.style || {}, styles.bodyRequired]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

const SmallPrint: React.SFC<TextProperties> = (props: TextProperties) => {
  const children: string = (props as any).children
  const style = [styles.smallPrintDefault, props.style || {}, styles.smallPrintRequired]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

export { LargeHeadline, SmallHeadline, Subtitle, BodyText, SmallPrint }

interface Styles {
  largeHeadlineRequired: TextStyle
  largeHeadlineDefault: TextStyle
  smallHeadlineRequired: TextStyle
  smallHeadlineDefault: TextStyle
  subtitleRequired: TextStyle
  subtitleDefault: TextStyle
  bodyRequired: TextStyle
  bodyDefault: TextStyle
  smallPrintRequired: TextStyle
  smallPrintDefault: TextStyle
}

const styles = StyleSheet.create<Styles>({
  largeHeadlineDefault: {
    fontSize: 30,
    color: "white",
    textAlign: "center",
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },

  largeHeadlineRequired: {
    fontFamily: fonts["garamond-regular"],
  },

  smallHeadlineDefault: {
    fontSize: 30,
    color: "white",
    textAlign: "center",
  },

  smallHeadlineRequired: {
    fontFamily: fonts["garamond-regular"],
  },

  subtitleDefault: {
    fontSize: 20,
    color: "#808080", // spec says 50% white, which is not in our standard set of colours
    paddingLeft: 20,
    paddingRight: 20,
  },

  subtitleRequired: {
    fontFamily: fonts["garamond-regular"],
  },

  bodyDefault: {
    fontSize: 20,
    color: colors["gray-medium"],
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 18,
    marginBottom: 18,
    textAlign: "center",
  },

  bodyRequired: {
    fontFamily: fonts["garamond-regular"],
  },

  smallPrintDefault: {
    fontSize: 14,
    color: colors["gray-medium"],
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 18,
    marginBottom: 18,
    textAlign: "center",
  },

  smallPrintRequired: {
    fontFamily: fonts["garamond-regular"],
  },
})
