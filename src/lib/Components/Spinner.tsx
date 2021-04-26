import { color } from "palette"
import React from "react"
import {
  ActivityIndicator,
  Platform,
  processColor,
  requireNativeComponent,
  StyleSheet,
  View,
  ViewProps,
} from "react-native"

interface SpinnerProps extends ViewProps {
  spinnerColor?: string
  size?: {
    width: number
    height: number
  }
}

const Spinner: React.FC<SpinnerProps> = ({
  spinnerColor = color("black100"),
  size = {
    width: 22,
    height: 22,
  },
  ...props
}) => {
  if (Platform.OS === "ios") {
    const NativeSpinner: React.ComponentClass<any> = requireNativeComponent("ARSpinner")
    return (
      <View style={[props.style, styles.container]} testID={props.testID}>
        <NativeSpinner spinnerColor={processColor(spinnerColor)} style={{ size }} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} testID={props.testID}>
      <ActivityIndicator size="large" color={spinnerColor} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
})

export default Spinner
