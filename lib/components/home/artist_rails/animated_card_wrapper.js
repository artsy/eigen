/* @flow */
'use strict'

import React from 'react'
import { Animated, Easing, View } from 'react-native'

import ArtistCard from './artist_card'

const Animation = {
  yDelta: 20,
  duration: {
    followed_artist: 500,
    suggested_artist: 400,
  },
  easing: Easing.out(Easing.cubic),
}

export default class AnimatedCardWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      followedArtistAnimatedValues: {
        opacity: new Animated.Value(1),
        translateY: new Animated.Value(0),
      },
      suggestedArtistAnimatedValues: {
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(-Animation.yDelta),
      },
    }
  }

  followedArtistAnimation() {
    const { opacity, translateY } = this.state.followedArtistAnimatedValues
    const duration = Animation.duration.followed_artist
    const easing = Animation.easing
    return Animated.parallel([
      Animated.timing(opacity,    { duration, easing, toValue: 0 }),
      Animated.timing(translateY, { duration, easing, toValue: Animation.yDelta }),
    ])
  }

  suggestedArtistAnimation() {
    const { opacity, translateY } = this.state.suggestedArtistAnimatedValues
    const duration = Animation.duration.suggested_artist
    const easing = Animation.easing
    return Animated.parallel([
      Animated.timing(opacity,    { duration, easing, toValue: 1 }),
      Animated.timing(translateY, { duration, easing, toValue: 0 }),
    ])
  }

  /**
   * Once a suggested artist is available and has been rendered, start the animation.
   */
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.suggested_artist && this.props.suggested_artist) {
      Animated.sequence([
        this.followedArtistAnimation(),
        this.suggestedArtistAnimation(),
      ]).start(this.props.onCardReplaced)
    }
  }

  renderCard() {
    const { opacity, translateY } = this.state.followedArtistAnimatedValues
    const style = {
      opacity,
      transform: [{ translateY }],
      zIndex: 1,
    }
    return (
      <Animated.View style={style}>
        <ArtistCard artist={this.props.artist} onFollow={this.props.onFollow} />
      </Animated.View>
    )
  }

  renderSuggestedCard() {
    if (this.props.suggested_artist) {
      const { opacity, translateY } = this.state.suggestedArtistAnimatedValues
      const style = {
        opacity,
        transform: [{ translateY }],
        // Place this component exactly over the original artist card, which is where the card should end up at the end
        // of the animation.
        zIndex: 2,
        position: 'absolute',
        top: 0,
      }
      return (
        <Animated.View style={style}>
          <ArtistCard artist={this.props.suggested_artist} />
        </Animated.View>
      )
    }
  }

  render() {
    return (
      <View>
        {this.renderCard()}
        {this.renderSuggestedCard()}
      </View>
    )
  }
}
