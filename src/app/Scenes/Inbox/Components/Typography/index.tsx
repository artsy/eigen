import React from "react"
import { StyleSheet, Text, TextProps, TextStyle } from "react-native"

import { useTheme } from "palette"

const LargeHeadline: React.FC<TextProps> = (props) => {
  const { theme } = useTheme()
  const children: string = (props as any).children
  const style = [styles.largeDefault, props.style || {}, { fontFamily: theme.fonts.sans.regular }]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

const SmallHeadline: React.FC<TextProps & { disabled?: boolean }> = (props) => {
  const { theme, color } = useTheme()
  const children: string = (props as any).children
  const style = [
    styles.smallDefault,
    props.disabled && { color: color("black30") },
    props.style || {},
    { fontFamily: theme.fonts.sans.regular },
  ]
  return (
    <Text key={children} style={style}>
      {(children || "").toUpperCase()}
    </Text>
  )
}

const Subtitle: React.FC<TextProps> = (props) => {
  const children: string = (props as any).children
  const style = [styles.subtitleDefault, props.style || {}, styles.subtitleRequired]
  return (
    <Text {...props} key={children} style={style}>
      {children}
    </Text>
  )
}

const FromSignatureText: React.FC<TextProps> = (props) => {
  const { color } = useTheme()
  const children: string = (props as any).children
  const style = [styles.fromSignatureDefault, { color: color("black30") }, props.style || {}]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

const MetadataText: React.FC<TextProps> = (props) => {
  const { theme, color } = useTheme()
  const children: string = (props as any).children
  const style = [
    styles.metadataDefault,
    { color: color("black30") },
    props.style || {},
    { fontFamily: theme.fonts.sans.regular },
  ]
  return (
    <Text key={children} style={style}>
      {children.toUpperCase()}
    </Text>
  )
}

const PreviewText: React.FC<TextProps> = (props) => {
  const children: string = (props as any).children
  const style = [styles.bodyDefault, props.style || {}, styles.bodyRequired]
  return (
    <Text key={children} style={style} numberOfLines={1} ellipsizeMode="tail">
      {children}
    </Text>
  )
}

const BodyText: React.FC<TextProps & { disabled?: boolean }> = (props) => {
  const { color } = useTheme()
  const children: string = (props as any).children
  const style = [
    styles.bodyDefault,
    props.disabled && { color: color("black30") },
    props.style || {},
    styles.bodyRequired,
  ]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

export {
  LargeHeadline,
  SmallHeadline,
  Subtitle,
  FromSignatureText,
  MetadataText,
  PreviewText,
  BodyText,
}

interface Styles {
  largeDefault: TextStyle
  smallDefault: TextStyle
  subtitleRequired: TextStyle
  subtitleDefault: TextStyle
  fromSignatureDefault: TextStyle
  metadataDefault: TextStyle
  bodyRequired: TextStyle
  bodyDefault: TextStyle
}

const styles = StyleSheet.create<Styles>({
  largeDefault: {
    fontSize: 30,
    color: "black",
    textAlign: "left",
    paddingLeft: 20,
    paddingRight: 20,
  },

  smallDefault: {
    fontSize: 11,
    color: "black",
    textAlign: "left",
  },

  subtitleDefault: {
    fontSize: 14,
    color: "black",
  },

  subtitleRequired: {
    fontFamily: "ReactNativeAGaramondPro-Italic",
  },

  fromSignatureDefault: {
    fontFamily: "ReactNativeAGaramondPro-Regular",
  },

  metadataDefault: {
    fontSize: 11,
    textAlign: "left",
  },

  bodyDefault: {
    fontSize: 16,
    color: "black",
    textAlign: "left",
  },

  bodyRequired: {
    fontFamily: "ReactNativeAGaramondPro-Regular",
  },
})
