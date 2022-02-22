import React from "react"
import { Animated, StyleProp, ViewProps, ViewStyle } from "react-native"

interface CssTransitionProps extends ViewProps {
  animate: string[]
  duration: number
}

interface CssTransitionState {
  previousStyle: StyleProp<ViewStyle>
}

export class CssTransition extends React.Component<CssTransitionProps, CssTransitionState> {
  private animatedValue: Animated.Value = new Animated.Value(0)

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
      // not all style properties are animatable with the native driver
      useNativeDriver: false,
    }).start()
  }

  render() {
    const { style, duration, ...props } = this.props
    const { previousStyle } = this.state

    const prevStyle = this.mergeStyles(previousStyle)
    const nextStyle = this.mergeStyles(style)
    const animateCheckboxStyle = this.props.animate.reduce((acc, cssProperty) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      acc[cssProperty] = this.animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [prevStyle[cssProperty], nextStyle[cssProperty]],
      })
      return acc
    }, {})

    return <Animated.View style={[style, animateCheckboxStyle]} {...props} />
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  private mergeStyles(style) {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    return style.reduce((acc, obj) => {
      Object.keys(obj).forEach((key) => (acc[key] = obj[key]))
      return acc
    }, {})
  }
}
