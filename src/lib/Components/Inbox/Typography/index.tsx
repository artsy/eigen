import * as React from "react"
import { StyleSheet, Text, TextProperties, TextStyle } from "react-native"
import styled from "styled-components"

import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

const LargeHeadline: React.SFC<TextProperties> = props => {
  const children: string = (props as any).children
  const style = [styles.largeDefault, props.style || {}, styles.largeRequired]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

const SmallHeadline: React.SFC<TextProperties & { disabled?: boolean }> = props => {
  const children: string = (props as any).children
  const style = [styles.smallDefault, props.disabled && styles.disabled, props.style || {}, styles.smallRequired]
  return (
    <Text key={children} style={style}>
      {(children || "").toUpperCase()}
    </Text>
  )
}

const Subtitle: React.SFC<TextProperties> = props => {
  const children: string = (props as any).children
  const style = [styles.subtitleDefault, props.style || {}, styles.subtitleRequired]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

const FromSignatureText: React.SFC<TextProperties> = props => {
  const children: string = (props as any).children
  const style = [styles.fromSignatureDefault, props.style || {}]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

const MetadataText: React.SFC<TextProperties> = props => {
  const children: string = (props as any).children
  const style = [styles.metadataDefault, props.style || {}, styles.metadataRequired]
  return (
    <Text key={children} style={style}>
      {children.toUpperCase()}
    </Text>
  )
}

const PreviewText: React.SFC<TextProperties> = props => {
  const children: string = (props as any).children
  const style = [styles.bodyDefault, props.style || {}, styles.bodyRequired]
  return (
    <Text key={children} style={style} numberOfLines={1} ellipsizeMode={"tail"}>
      {children}
    </Text>
  )
}

const BodyText: React.SFC<TextProperties & { disabled?: boolean }> = props => {
  const children: string = (props as any).children
  const style = [styles.bodyDefault, props.disabled && styles.disabled, props.style || {}, styles.bodyRequired]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

export { LargeHeadline, SmallHeadline, Subtitle, FromSignatureText, MetadataText, PreviewText, BodyText }

interface Styles {
  largeRequired: TextStyle
  largeDefault: TextStyle
  smallRequired: TextStyle
  smallDefault: TextStyle
  subtitleRequired: TextStyle
  subtitleDefault: TextStyle
  fromSignatureDefault: TextStyle
  metadataRequired: TextStyle
  metadataDefault: TextStyle
  bodyRequired: TextStyle
  bodyDefault: TextStyle
  disabled: TextStyle
}

const styles = StyleSheet.create<Styles>({
  largeDefault: {
    fontSize: 30,
    color: "black",
    textAlign: "left",
    paddingLeft: 20,
    paddingRight: 20,
  },

  largeRequired: {
    fontFamily: fonts["garamond-regular"],
  },

  smallDefault: {
    fontSize: 11,
    color: "black",
    textAlign: "left",
  },

  smallRequired: {
    fontFamily: fonts["avant-garde-regular"],
  },

  subtitleDefault: {
    fontSize: 14,
    color: "black",
  },

  subtitleRequired: {
    fontFamily: fonts["garamond-italic"],
  },

  fromSignatureDefault: {
    fontFamily: fonts["garamond-regular"],
    color: colors["gray-medium"],
  },

  metadataDefault: {
    fontSize: 11,
    color: colors["gray-medium"],
    textAlign: "left",
  },

  metadataRequired: {
    fontFamily: fonts["avant-garde-regular"],
  },

  bodyDefault: {
    fontSize: 16,
    color: "black",
    textAlign: "left",
  },

  bodyRequired: {
    fontFamily: fonts["garamond-regular"],
  },

  disabled: {
    color: colors["gray-medium"],
  },
})
