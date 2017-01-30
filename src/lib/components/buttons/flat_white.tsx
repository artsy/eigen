import React from 'react'
import { Animated, StyleSheet, TouchableHighlight, View } from 'react-native'

import Headline from '../text/headline'
import colors from '../../../data/colors'

const AnimationDuration = 250
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableHighlight)
const AnimatedHeadline = Animated.createAnimatedComponent(Headline)

export default class WhiteButton extends React.Component {
  state: {
    textOpacity: Animated.Value,
    backgroundColor: Animated.Value
  }

  constructor(props: any) {
    super(props)
    this.state = {
      textOpacity: new Animated.Value(1),
      backgroundColor: new Animated.Value(props.selected ? 1 : 0)
    }
  }

  componentWillUpdate(nextProps: any, nextState: any) {
    if (this.props.selected !== nextProps.selected) {
      nextState.textOpacity.setValue(0)
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (this.props.selected !== prevProps.selected) {
      Animated.parallel([
        Animated.timing(this.state.textOpacity, { toValue: 1, duration: AnimationDuration }),
        Animated.timing(this.state.backgroundColor, { toValue: this.props.selected ? 1 : 0, duration: AnimationDuration }),
      ]).start(this.props.onSelectionAnimationFinished)
    }
  }

  render() {
    const backgroundColor = this.state.backgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: (['white', 'black']: string[])
    })
    const styling = {
      underlayColor: (this.props.selected ? 'black' : colors['purple-regular']),
      style: [styles.button, { backgroundColor }, this.props.style],
    }
    let content = <AnimatedHeadline style={[styles.text, { opacity: this.state.textOpacity }]}>{this.props.text}</AnimatedHeadline>

    return (
      <AnimatedTouchable onPress={this.props.onPress} activeOpacity={1} {...styling}>
        <View>{content}</View>
      </AnimatedTouchable>
    )
  }
}

WhiteButton.propTypes = {
  text: React.PropTypes.string,
  selected: React.PropTypes.bool,
  onPress: React.PropTypes.func,
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors['gray-regular'],
    borderWidth: 1
  },
  text: {
    fontFamily: 'AGaramondPro-Regular',
    color: 'black'
  }
})
