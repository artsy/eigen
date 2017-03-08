import * as React from "react"
import { ColorPropType, processColor, requireNativeComponent, StyleSheet, View, ViewProperties } from "react-native"

interface SpinnerProps extends ViewProperties {
  spinnerColor?: string
}

export default class Spinner extends React.Component<SpinnerProps, any> {
  static propTypes = {
    spinnerColor: ColorPropType,
  }

  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <NativeSpinner spinnerColor={processColor(this.props.spinnerColor)} style={styles.spinner} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: 22,
    height: 22,
  },
})

const NativeSpinner: React.ComponentClass<any> = requireNativeComponent("ARSpinner", Spinner)
