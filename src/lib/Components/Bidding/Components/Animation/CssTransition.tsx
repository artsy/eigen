import React from "react"
import { Animated, StyleProp, ViewProperties, ViewStyle } from "react-native"

interface CssTransitionProps extends ViewProperties {
  animate: string[]
  duration: number
}

interface CssTransitionState {
  previousStyle: StyleProp<ViewStyle>
}

export class CssTransition extends React.Component<CssTransitionProps, CssTransitionState> {
  private animatedValue: Animated.Value = new Animated.Value(0)

  constructor(props) {
    super(props)

    this.state = {
      previousStyle: props.style,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: CssTransitionProps) {
    this.setState({
      previousStyle: this.props.style,
    })

    this.animatedValue = new Animated.Value(0)
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: nextProps.duration,
    }).start()
  }

  render() {
    const { style, duration, ...props } = this.props
    const { previousStyle } = this.state

    const prevStyle = this.mergeStyles(previousStyle)
    const nextStyle = this.mergeStyles(style)
    const animateCheckboxStyle = this.props.animate.reduce((acc, cssProperty) => {
      acc[cssProperty] = this.animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [prevStyle[cssProperty], nextStyle[cssProperty]],
      })
      return acc
    }, {})

    return <Animated.View style={[style, animateCheckboxStyle]} {...props} />
  }

  private mergeStyles(style) {
    return style.reduce((acc, obj) => {
      Object.keys(obj).forEach(key => (acc[key] = obj[key]))
      return acc
    }, {})
  }
}
