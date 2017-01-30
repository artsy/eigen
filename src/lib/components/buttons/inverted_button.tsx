import React from 'react'
import { Animated, StyleSheet, TouchableHighlight, View } from 'react-native'

import Headline from '../text/headline'
import colors from '../../../data/colors'
import Spinner from '../spinner'

const AnimationDuration = 250
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableHighlight)
const AnimatedHeadline = Animated.createAnimatedComponent(Headline)

export default class InvertedButton extends React.Component {
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
      outputRange: (['black', colors['purple-regular']]: string[])
    })
    const styling = {
      underlayColor: (this.props.selected ? 'black' : colors['purple-regular']),
      style: [styles.button, { backgroundColor }],
    }
    let content = null
    if (this.props.inProgress) {
      content = <Spinner spinnerColor="white" style={{ backgroundColor: 'transparent' }} />
    } else {
      content = <AnimatedHeadline style={[styles.text, { opacity: this.state.textOpacity }]}>{this.props.text}</AnimatedHeadline>
    }
    return (
      <AnimatedTouchable onPress={this.props.onPress} activeOpacity={1} disabled={this.props.inProgress} {...styling}>
        <View>{content}</View>
      </AnimatedTouchable>
    )
  }
}

InvertedButton.propTypes = {
  text: React.PropTypes.string,
  selected: React.PropTypes.bool,
  inProgress: React.PropTypes.bool,
  onPress: React.PropTypes.func,
  onSelectionAnimationFinished: React.PropTypes.func,
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white'
  }
})
