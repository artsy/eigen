import React from "react"
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from "react-native"

import Headline from "../Text/Headline"

import { ButtonProps } from "./"

const AnimationDuration = 250
const AnimatedView = Animated.createAnimatedComponent(View)
const AnimatedHeadline = Animated.createAnimatedComponent(Headline)

// An abstract class meant to be used by other components by passing in their
// own theme settings. See index.tsx for some examples.

interface ColorTheme {
  foreground: string
  background: string
  border: string
}

/** Possible display states for the button */
enum DisplayState {
  Enabled,
  Highlighted,
  Disabled,
}

interface Props extends ButtonProps {
  /** Color setups for the different states */
  stateColors: {
    enabled: ColorTheme
    highlighted: ColorTheme
    disabled: ColorTheme
  }
}

interface State {
  /** What is  */
  displayState: DisplayState

  textOpacity: Animated.Value
  backgroundColor: Animated.Value
  foregroundColor: Animated.Value
  borderColor: Animated.Value

  ignoreEndHighlight?: boolean
}

export default class Button extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const displayState = props.onPress && props.onPress !== undefined ? DisplayState.Enabled : DisplayState.Disabled
    this.state = {
      textOpacity: new Animated.Value(1),
      displayState,
      backgroundColor: new Animated.Value(displayState),
      foregroundColor: new Animated.Value(displayState),
      borderColor: new Animated.Value(displayState),
    }
  }

  componentDidUpdate(_prevProps: any, prevState: any) {
    if (this.state.displayState !== prevState.displayState) {
      // Don't animate in when it's the initial press down
      const showHighlight =
        this.state.displayState === DisplayState.Highlighted && prevState.displayState === DisplayState.Enabled

      const duration = showHighlight ? 0 : AnimationDuration

      Animated.parallel([
        Animated.timing(this.state.textOpacity, { toValue: 1, duration }),
        Animated.timing(this.state.backgroundColor, { toValue: this.state.displayState, duration }),
        Animated.timing(this.state.foregroundColor, { toValue: this.state.displayState, duration }),
        Animated.timing(this.state.borderColor, { toValue: this.state.displayState, duration }),
      ]).start(this.props.onSelectionAnimationFinished)
    }
  }

  startHighlight = () => {
    if (this.props.onPress) {
      this.setState({ displayState: DisplayState.Highlighted })
    }
  }

  endHighlight = () => {
    if (this.props.onPress && !this.state.ignoreEndHighlight) {
      this.setState({ displayState: DisplayState.Enabled })
    }
  }

  onPress = args => {
    if (this.props.onPress) {
      // Did someone tap really fast? Flick the highlighted state
      if (this.state.displayState === DisplayState.Enabled) {
        this.setState({ displayState: DisplayState.Highlighted, ignoreEndHighlight: true })
        setTimeout(() => this.setState({ displayState: DisplayState.Enabled, ignoreEndHighlight: false }), 0.3)
      } else {
        // Was already selected
        this.setState({ displayState: DisplayState.Enabled })
      }
      this.props.onPress(args)
    }
  }

  render() {
    const backgroundColor = this.state.backgroundColor.interpolate({
      inputRange: [DisplayState.Enabled, DisplayState.Highlighted, DisplayState.Disabled],
      outputRange: [
        this.props.stateColors.enabled.background,
        this.props.stateColors.highlighted.background,
        this.props.stateColors.disabled.background,
      ],
    })

    const color = this.state.backgroundColor.interpolate({
      inputRange: [DisplayState.Enabled, DisplayState.Highlighted, DisplayState.Disabled],
      outputRange: [
        this.props.stateColors.enabled.foreground,
        this.props.stateColors.highlighted.foreground,
        this.props.stateColors.disabled.foreground,
      ],
    })

    const borderColor = this.state.borderColor.interpolate({
      inputRange: [DisplayState.Enabled, DisplayState.Highlighted, DisplayState.Disabled],
      outputRange: [
        this.props.stateColors.enabled.border,
        this.props.stateColors.highlighted.border,
        this.props.stateColors.disabled.border,
      ],
    })

    const styling = {
      style: [styles.button, { backgroundColor, borderColor }, this.props.style],
    }

    const headlineStyles = [styles.text, { opacity: this.state.textOpacity, color }]

    return (
      <TouchableWithoutFeedback onPress={this.onPress} onPressIn={this.startHighlight} onPressOut={this.endHighlight}>
        <AnimatedView {...styling}>
          <AnimatedHeadline style={headlineStyles}>
            {this.props.text}
          </AnimatedHeadline>
        </AnimatedView>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    height: 36,
  },
  text: {
    fontFamily: "AGaramondPro-Regular",
    color: "black",
  },
})
