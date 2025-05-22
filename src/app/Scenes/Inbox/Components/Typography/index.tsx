import { useColor, useTheme } from "@artsy/palette-mobile"
import { StyleSheet, Text, TextProps, TextStyle } from "react-native"

const LargeHeadline: React.FC<TextProps> = (props) => {
  const { theme } = useTheme()
  const color = useColor()

  const children: string = (props as any).children
  const style = [
    {
      fontSize: 30,
      color: color("mono100"),
      paddingLeft: 20,
      paddingRight: 20,
    },
    props.style || {},
    { fontFamily: theme.fonts.sans.regular },
  ]
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
    {
      fontSize: 11,
      color: color("mono100"),
    },
    props.disabled && { color: color("mono30") },
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
  const color = useColor()
  const children: string = (props as any).children
  const style = [
    {
      fontSize: 14,
      color: color("mono100"),
    },
    props.style || {},
    styles.subtitleRequired,
  ]

  return (
    <Text {...props} key={children} style={style}>
      {children}
    </Text>
  )
}

const FromSignatureText: React.FC<TextProps> = (props) => {
  const { color } = useTheme()
  const children: string = (props as any).children
  const style = [styles.fromSignatureDefault, { color: color("mono30") }, props.style || {}]
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
    { color: color("mono30") },
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
  const color = useColor()
  const children: string = (props as any).children
  const style = [
    {
      fontSize: 16,
      color: color("mono100"),
    },
    props.style || {},
    styles.bodyRequired,
  ]
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
    {
      fontSize: 16,
      color: color("mono100"),
    },
    props.disabled && { color: color("mono30") },
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
  subtitleRequired: TextStyle
  fromSignatureDefault: TextStyle
  metadataDefault: TextStyle
  bodyRequired: TextStyle
  bodyDefault: TextStyle
}

const styles = StyleSheet.create<Styles>({
  subtitleRequired: {
    fontFamily: "Unica77LL-Italic",
  },

  fromSignatureDefault: {
    fontFamily: "Unica77LL-Regular",
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
    fontFamily: "Unica77LL-Regular",
  },
})
