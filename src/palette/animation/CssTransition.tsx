import React from "react"
import {
  Animated,
  Falsy,
  RecursiveArray,
  RegisteredStyle,
  ViewProps,
  ViewStyle,
} from "react-native"

type AnimateCssProperty = keyof ViewStyle
type ArrayStyleProp<T> = RecursiveArray<T | RegisteredStyle<T>> | Falsy

interface CssTransitionProps extends ViewProps {
  animate: AnimateCssProperty[]
  duration: number
  style?: ArrayStyleProp<ViewStyle>
}

interface CssTransitionState {
  previousStyle: ArrayStyleProp<ViewStyle>
}

export class CssTransition extends React.Component<CssTransitionProps, CssTransitionState> {
  private animatedValue: Animated.Value = new Animated.Value(0)

  constructor(props: CssTransitionProps) {
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
    const animateCheckboxStyle = this.props.animate.reduce<Animated.WithAnimatedObject<ViewStyle>>(
      (acc, cssProperty) => {
        // @ts-ignore
        acc[cssProperty] = this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [prevStyle[cssProperty], nextStyle[cssProperty]] as number[] | string[],
        })
        return acc
      },
      {}
    )

    return <Animated.View style={[style, animateCheckboxStyle]} {...props} />
  }

  private mergeStyles(style: ArrayStyleProp<ViewStyle>): ViewStyle {
    if (!Array.isArray(style)) {
      return {}
    }

    return style.reduce<Record<string, any>>((acc, obj) => {
      Object.entries(obj).forEach((entry) => {
        const [key, value] = entry
        acc[key] = value
      })

      return acc
    }, {})
  }
}
