import React from "react"
import { Animated, ViewProperties } from "react-native"

interface FadeProps extends ViewProperties {
  show: boolean
  duration?: number
}

interface FadeState {
  visible: boolean
}

export class Fade extends React.Component<FadeProps, FadeState> {
  private visibility: Animated.Value

  constructor(props) {
    super(props)

    this.state = {
      visible: props.show,
    }
  }

  UNSAFE_componentWillMount() {
    this.visibility = new Animated.Value(this.props.show ? 1 : 0)
  }

  UNSAFE_componentWillReceiveProps(nextProps: FadeProps) {
    if (nextProps.show) {
      this.setState({ visible: true })
    }

    Animated.timing(this.visibility, {
      toValue: nextProps.show ? 1 : 0,
      duration: nextProps.duration,
    }).start(() => this.setState({ visible: nextProps.show }))
  }

  render() {
    const { style, children, ...props } = this.props

    const containerStyle = {
      opacity: this.visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          scale: this.visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [1.1, 1],
          }),
        },
      ],
    }

    const combinedStyle = [containerStyle, style]

    return (
      <Animated.View style={this.state.visible ? combinedStyle : containerStyle} {...props}>
        {this.state.visible && children}
      </Animated.View>
    )
  }
}
