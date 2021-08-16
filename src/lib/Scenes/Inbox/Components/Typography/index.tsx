import React from "react"
import { StyleSheet, Text, TextProps, TextStyle } from "react-native"

import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import { ThemeV2Type, ThemeV3Type, useTheme, useThemeConfig } from "palette"

const LargeHeadline: React.FC<TextProps> = (props) => {
  const { theme } = useTheme()
  const fontFamily = useThemeConfig({
    v2: (theme as ThemeV2Type).fonts.sans,
    v3: (theme as ThemeV3Type).fonts.sans.regular,
  })
  const children: string = (props as any).children
  const style = [styles.largeDefault, props.style || {}, { fontFamily }]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

const SmallHeadline: React.FC<TextProps & { disabled?: boolean }> = (props) => {
  const { theme } = useTheme()
  const fontFamily = useThemeConfig({
    v2: (theme as ThemeV2Type).fonts.sans,
    v3: (theme as ThemeV3Type).fonts.sans.regular,
  })
  const children: string = (props as any).children
  const style = [styles.smallDefault, props.disabled && styles.disabled, props.style || {}, { fontFamily }]
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
  const children: string = (props as any).children
  const style = [styles.fromSignatureDefault, props.style || {}]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

const MetadataText: React.FC<TextProps> = (props) => {
  const { theme } = useTheme()
  const fontFamily = useThemeConfig({
    v2: (theme as ThemeV2Type).fonts.sans,
    v3: (theme as ThemeV3Type).fonts.sans.regular,
  })
  const children: string = (props as any).children
  const style = [styles.metadataDefault, props.style || {}, { fontFamily }]
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
    <Text key={children} style={style} numberOfLines={1} ellipsizeMode={"tail"}>
      {children}
    </Text>
  )
}

const BodyText: React.FC<TextProps & { disabled?: boolean }> = (props) => {
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
  largeDefault: TextStyle
  smallDefault: TextStyle
  subtitleRequired: TextStyle
  subtitleDefault: TextStyle
  fromSignatureDefault: TextStyle
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
