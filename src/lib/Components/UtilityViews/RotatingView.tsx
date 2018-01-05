/**
 * Created by nirlevy on 02/07/2017.
 * MIT Licence
 * See: https://gist.github.com/levynir/5962de39879a0b8eb1a2fd77ccedb2d8
 */

import React, { Component } from "react"
import { Animated, Easing, ViewStyle } from "react-native"

export interface State {
  spinValue: any
}

export interface Props {
  style?: ViewStyle
  /** Useful if you want to rotate to half way (0.5) or something */
  toValue?: number
  /** How many ms does it take to do a full rotation */
  rotationDuration?: number
  /** Callback at the end, if needed */
  onFinishedAnimating?: () => void
  /** Continuously loop? Defaults to false */
  loop?: boolean
}

export class RotatingView extends Component<Props, State> {
  state = {
    spinValue: new Animated.Value(0),
  }

  spin() {
    this.state.spinValue.setValue(0)
    Animated.timing(this.state.spinValue, {
      toValue: this.props.toValue || 1,
      duration: this.props.rotationDuration || 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      if (this.props.loop) {
        this.spin()
      }
      if (this.props.onFinishedAnimating) {
        this.props.onFinishedAnimating()
      }
    })
  }

  componentDidMount() {
    this.spin()
  }

  render() {
    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    })

    return (
      <Animated.View
        style={{
          ...this.props.style,
          transform: [{ rotate: spin }],
        }}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}
