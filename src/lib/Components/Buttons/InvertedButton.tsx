import React from "react"
import { Animated, Insets, StyleProp, StyleSheet, TextStyle, TouchableHighlight, View } from "react-native"

import colors from "lib/data/colors"
import Spinner from "../Spinner"
import PrimaryButtonText from "../Text/PrimaryButtonText"

const AnimationDuration = 250
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableHighlight)
const AnimatedHeadline = Animated.createAnimatedComponent(PrimaryButtonText)

// Caveat: This button doesn't set its own height, this could/should
// probably be considered a bug.
// TODO: When moving to palette, fix this.

export interface InvertedButtonProps extends React.Props<InvertedButton> {
  /** Copy to use as on the button */
  text: string
  /** Props to pass into the Text element of the button */
  textStyle?: StyleProp<TextStyle>
  /** Is the button currently selected? */
  selected?: boolean
  /** Should this button be interactable */
  disabled?: boolean
  /** Should the button represent async work? */
  inProgress?: boolean
  /** Should the button have a grayBorder (should this be a style props on the view?) */
  grayBorder?: boolean
  /** Unsure... */
  noBackground?: boolean
  /** Tap handler */
  onPress?: React.TouchEventHandler<InvertedButton>
  /** Optional animation callback */
  onSelectionAnimationFinished?: Animated.EndCallback
  /** Offsets for the tap space to be increased, e.g. {top: 10, bottom: 10, left: 0, right: 0} to extend by 10 vertically */
  hitSlop?: Insets
}

interface InvertedButtonState {
  textOpacity: Animated.Value
  backgroundColor: Animated.Value
  borderColor: Animated.Value
}

export default class InvertedButton extends React.Component<InvertedButtonProps, InvertedButtonState> {
  constructor(props: any) {
    super(props)
    this.state = {
      textOpacity: new Animated.Value(1),
      backgroundColor: new Animated.Value(props.selected ? 1 : 0),
      borderColor: new Animated.Value(props.selected ? 1 : 0),
    }
  }

  componentWillUpdate(nextProps: any, nextState: any) {
    if (this.props.selected !== nextProps.selected) {
      nextState.textOpacity.setValue(0)
    }
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.selected !== prevProps.selected) {
      const duration = AnimationDuration
      Animated.parallel([
        Animated.timing(this.state.textOpacity, { toValue: 1, duration }),
        Animated.timing(this.state.borderColor, { toValue: this.props.selected ? 1 : 0, duration }),
        Animated.timing(this.state.backgroundColor, { toValue: this.props.selected ? 1 : 0, duration }),
      ]).start(this.props.onSelectionAnimationFinished)
    }
  }

  render() {
    let backgroundColor
    let borderColor
    let styling
    let textStyle
    if (this.props.grayBorder) {
      backgroundColor = this.state.backgroundColor.interpolate({
        inputRange: [0, 1],
        outputRange: ["black", "white"],
      })
      borderColor = this.state.borderColor.interpolate({
        inputRange: [0, 1],
        outputRange: ["black", colors["gray-regular"]],
      })
      styling = {
        underlayColor: this.props.selected ? "black" : "white",
        style: [styles.button, { backgroundColor, borderColor, borderWidth: 1 }],
      }
      textStyle = { color: this.props.selected ? "black" : "white" }
    } else if (this.props.noBackground) {
      textStyle = { color: this.props.selected ? colors["purple-regular"] : "black" }
      styling = {
        underlayColor: "transparent",
        style: [styles.button, { backgroundColor }],
      }
    } else {
      backgroundColor = this.state.backgroundColor.interpolate({
        inputRange: [0, 1],
        outputRange: ["black", colors["purple-regular"]],
      })
      styling = {
        underlayColor: this.props.selected ? "black" : colors["purple-regular"],
        style: [styles.button, { backgroundColor }],
      }
    }

    let content: JSX.Element = null
    if (this.props.inProgress) {
      content = (
        <Spinner
          spinnerColor={this.props.noBackground ? "black" : "white"}
          style={{ backgroundColor: "transparent" }}
        />
      )
    } else {
      textStyle = this.props.textStyle || textStyle
      const headlineStyles = [styles.text, textStyle, { opacity: this.state.textOpacity }]
      content = <AnimatedHeadline style={headlineStyles}>{this.props.text}</AnimatedHeadline>
    }
    return (
      <AnimatedTouchable
        onPress={this.props.onPress}
        activeOpacity={1}
        disabled={this.props.inProgress || this.props.disabled}
        hitSlop={this.props.hitSlop}
        {...styling}
      >
        <View>{content}</View>
      </AnimatedTouchable>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
  },
  text: {
    color: "white",
  },
})
