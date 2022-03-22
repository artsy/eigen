import { useTheme } from "palette"
import { StyleSheet, Text, TextProps, TextStyle } from "react-native"

const LargeHeadline: React.FC<TextProps> = (props) => {
  const children: string = (props as any).children
  const style = [styles.largeHeadlineDefault, props.style || {}, styles.largeHeadlineRequired]
  return (
    <Text key={children} style={style}>
      {props.children}
    </Text>
  )
}

const SmallHeadline: React.FC<TextProps> = (props) => {
  const children: string = (props as any).children
  const style = [styles.smallHeadlineDefault, props.style || {}, styles.smallHeadlineRequired]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

const Subtitle: React.FC<TextProps> = (props) => {
  const children: string = (props as any).children
  const style = [styles.subtitleDefault, props.style || {}, styles.subtitleRequired]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

const BodyText: React.FC<TextProps> = (props) => {
  const { color } = useTheme()
  const children: string = (props as any).children
  const style = [
    styles.bodyDefault,
    { color: color("black30") },
    props.style || {},
    styles.bodyRequired,
  ]
  return (
    <Text key={children} style={style}>
      {children}
    </Text>
  )
}

const SmallPrint: React.FC<TextProps> = (props) => {
  const { color } = useTheme()
  const children: string = (props as any).children
  const style = [
    styles.smallPrintDefault,
    { color: color("black30") },
    props.style || {},
    styles.smallPrintRequired,
  ]
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
    fontFamily: "ReactNativeAGaramondPro-Regular",
  },

  smallHeadlineDefault: {
    fontSize: 30,
    color: "white",
    textAlign: "center",
  },

  smallHeadlineRequired: {
    fontFamily: "ReactNativeAGaramondPro-Regular",
  },

  subtitleDefault: {
    fontSize: 20,
    color: "#808080", // spec says 50% white, which is not in our standard set of colours
    paddingLeft: 20,
    paddingRight: 20,
  },

  subtitleRequired: {
    fontFamily: "ReactNativeAGaramondPro-Regular",
  },

  bodyDefault: {
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 18,
    marginBottom: 18,
    textAlign: "center",
  },

  bodyRequired: {
    fontFamily: "ReactNativeAGaramondPro-Regular",
  },

  smallPrintDefault: {
    fontSize: 14,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 18,
    marginBottom: 18,
    textAlign: "center",
  },

  smallPrintRequired: {
    fontFamily: "ReactNativeAGaramondPro-Regular",
  },
})
