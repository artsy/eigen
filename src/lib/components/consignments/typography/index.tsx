import * as React from "react"
import { StyleSheet, Text, TextProperties, TextStyle } from "react-native"

import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

const LargeHeadline = (props: TextProperties) => {
  const children: string = (props as any).children
  const style = [styles.largeDefault, props.style || {}, styles.largeRequired]
  return <Text key={children} style ={style}>{children}</Text>
}

const SmallHeadline = (props: TextProperties) => {
  const children: string = (props as any).children
  const style = [styles.smallDefault, props.style || {}, styles.smallRequired]
  return <Text key={children} style ={style}>{children}</Text>
}

const Subtitle = (props: TextProperties) => {
  const children: string = (props as any).children
  const style = [styles.subtitleDefault, props.style || {}, styles.subtitleRequired]
  return <Text key={children} style ={style}>{children}</Text>
}

export  {
  LargeHeadline,
  SmallHeadline,
  Subtitle
}

interface Styles {
  largeRequired: TextStyle
  largeDefault: TextStyle
  smallRequired: TextStyle
  smallDefault: TextStyle
  subtitleRequired: TextStyle
  subtitleDefault: TextStyle
}

const styles = StyleSheet.create<Styles>({
  largeDefault: {
    fontSize:  30,
    color: "white",
    textAlign: "center",
  },

  largeRequired: {
    fontFamily: fonts["garamond-regular"],
  },

  smallDefault: {
    fontSize:  30,
    color: "white",
    textAlign: "center",
  },

  smallRequired: {
    fontFamily: fonts["garamond-regular"],
  },

 subtitleDefault: {
    fontSize:  20,
    color: colors["gray-medium"],
    paddingLeft: 25,
    paddingRight: 25,
  },

  subtitleRequired: {
    fontFamily: fonts["garamond-italic"],
  },
})
