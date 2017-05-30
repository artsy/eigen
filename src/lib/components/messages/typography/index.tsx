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
  return <Text key={children} style ={style}>{children.toUpperCase()}</Text>
}

const Subtitle = (props: TextProperties) => {
  const children: string = (props as any).children
  const style = [styles.subtitleDefault, props.style || {}, styles.subtitleRequired]
  return <Text key={children} style ={style}>{children}</Text>
}

const MetadataText = (props: TextProperties) => {
  const children: string = (props as any).children
  const style = [styles.metadataDefault, props.style || {}, styles.metadataRequired]
  return <Text key={children} style ={style}>{children.toUpperCase()}</Text>
}

const PreviewText = (props: TextProperties) => {
  const children: string = (props as any).children
  const style = [styles.bodyDefault, props.style || {}, styles.bodyRequired]
  return <Text key={children} style ={style} numberOfLines={1} ellipsizeMode={"tail"}>{children}</Text>
}

const BodyText = (props: TextProperties) => {
  const children: string = (props as any).children
  const style = [styles.bodyDefault, props.style || {}, styles.bodyRequired]
  return <Text key={children} style ={style}>{children}</Text>
}

export  {
  LargeHeadline,
  SmallHeadline,
  Subtitle,
  MetadataText,
  PreviewText,
  BodyText
}

interface Styles {
  largeRequired: TextStyle
  largeDefault: TextStyle
  smallRequired: TextStyle
  smallDefault: TextStyle
  subtitleRequired: TextStyle
  subtitleDefault: TextStyle
  metadataRequired: TextStyle
  metadataDefault: TextStyle
  bodyRequired: TextStyle
  bodyDefault: TextStyle
}

const styles = StyleSheet.create<Styles>({
  largeDefault: {
    fontSize:  30,
    color: "black",
    textAlign: "left",
    paddingLeft: 20,
    paddingRight: 20,
  },

  largeRequired: {
    fontFamily: fonts["garamond-regular"],
  },

  smallDefault: {
    fontSize:  12,
    color: "black",
    textAlign: "left",
  },

  smallRequired: {
    fontFamily: fonts["avant-garde-regular"],
  },

 subtitleDefault: {
    fontSize:  14,
    color: "black",
  },

  subtitleRequired: {
    fontFamily: fonts["garamond-italic"],
  },

  metadataDefault: {
    fontSize:  12,
    color: colors["gray-medium"],
    textAlign: "left",
  },

  metadataRequired: {
    fontFamily: fonts["avant-garde-regular"],
  },

  bodyDefault: {
    fontSize:  15,
    color: "black",
    textAlign: "left",
  },

  bodyRequired: {
    fontFamily: fonts["garamond-regular"],
  },
})
