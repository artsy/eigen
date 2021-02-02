import React from "react"
import {
  ActivityIndicator,
  ColorPropType,
  Platform,
  processColor,
  requireNativeComponent,
  StyleSheet,
  View,
  ViewProperties,
} from "react-native"

interface SpinnerProps extends ViewProperties {
  spinnerColor?: string
  size?: {
    width: number
    height: number
  }
}

export default class Spinner extends React.Component<SpinnerProps, any> {
  static propTypes = {
    spinnerColor: ColorPropType,
  }

  static defaultProps = {
    size: {
      width: 22,
      height: 22,
    },
  }

  render() {
    if (Platform.OS === "ios") {
      return (
        <View style={[this.props.style, styles.container]} testID={this.props.testID}>
          <NativeSpinner spinnerColor={processColor(this.props.spinnerColor)} style={{ size: this.props.size }} />
        </View>
      )
    }

    return (
      <View style={[this.props.style, styles.container]} testID={this.props.testID}>
        <ActivityIndicator />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
})

const NativeSpinner: React.ComponentClass<any> = requireNativeComponent("ARSpinner")
