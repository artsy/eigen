/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native'

import metaphysics from '../../../metaphysics'

import Spinner from '../../spinner'
import Separator from '../../separator'
import SectionTitle from '../section_title'
import ArtistCard from './artist_card'

const Animation = {
  yDelta: 20,
  duration: {
    followedArtist: 500,
    suggestedArtist: 400,
  },
  easing: Easing.out(Easing.cubic),
}

class ArtistRail extends React.Component {
  state: {
    artists: [Object],
  }

  constructor(props) {
    super(props)
    this.state = {
      artists: []
    }
  }

  componentDidMount() {
    this.props.relay.setVariables({ fetchContent: true })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rail.results) {
      const artists = nextProps.rail.results
      artists.forEach((artist) => {
        artist._animatedValues = {
          opacity: new Animated.Value(1),
          translateY: new Animated.Value(0),
        }
      })
      this.setState({ artists })
    }
  }

  followedArtistAnimation(followedArtist) {
    return new Promise((resolve, reject) => {
      const { opacity, translateY } = followedArtist._animatedValues
      const duration = Animation.duration.followedArtist
      const easing = Animation.easing
      Animated.parallel([
        Animated.timing(opacity,    { duration, easing, toValue: 0 }),
        Animated.timing(translateY, { duration, easing, toValue: Animation.yDelta }),
      ]).start(resolve)
    })
  }

  suggestedArtistAnimation(suggestedArtist) {
    return new Promise((resolve, reject) => {
      const { opacity, translateY } = suggestedArtist._animatedValues
      const duration = Animation.duration.suggestedArtist
      const easing = Animation.easing
      Animated.parallel([
        Animated.timing(opacity,    { duration, easing, toValue: 1 }),
        Animated.timing(translateY, { duration, easing, toValue: 0 }),
      ]).start(resolve)
    })
  }

  replaceFollowedArtist(followedArtist, suggestedArtist) {
    const artists = this.state.artists.slice(0)
    const index = artists.indexOf(followedArtist)
    if (suggestedArtist) {
      suggestedArtist._animatedValues = {
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(-Animation.yDelta),
      }
      artists[index] = suggestedArtist
    } else {
      // remove card when there is no suggestion
      artists.splice(index, 1)
    }
    this.setState({ artists })
    return suggestedArtist
  }

  handleFollowChange(followedArtist) {
    return metaphysics(suggestedArtistQuery(followedArtist._id))
      .then(({ me: { suggested_artists }}) => suggested_artists[0]) // return artist or undefined
      .catch(error => console.error(error))                         // return undefined
      .then((suggestedArtist) => this.followedArtistAnimation(followedArtist).then(() => suggestedArtist))
      .then((suggestedArtist) => this.replaceFollowedArtist(followedArtist, suggestedArtist))
      .then((suggestedArtist) => suggestedArtist && this.suggestedArtistAnimation(suggestedArtist))
  }

  renderModuleResults() {
    if (this.state.artists.length > 0) {
      return this.state.artists.map(artist => {
        // Compose key, because an artist may appear twice on the home view in different modules.
        const key = this.props.rail.__id + artist.__id
        const { opacity, translateY } = artist._animatedValues
        const style = { opacity, transform: [{ translateY }] }
        return (
          <Animated.View key={key} style={style}>
            <ArtistCard artist={artist} onFollow={() => this.handleFollowChange(artist)} />
          </Animated.View>
        )
      })
    } else {
      return <Spinner style={{ flex: 1 }} />
    }
  }

  title() {
    switch (this.props.rail.key) {
      case 'TRENDING':
        return 'Artists to Follow: Trending'
      case 'SUGGESTED':
        return 'Artists to Follow: Recommended for You'
      case 'POPULAR':
        return 'Artists to Follow: Popular'
    }
  }

  render() {
    return (
      <View>
        <View style={styles.title}><SectionTitle>{ this.title() }</SectionTitle></View>
        <ScrollView style={styles.cardContainer}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollsToTop={false}>
          {this.renderModuleResults()}
        </ScrollView>
      <Separator style={{marginTop: 5}}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    minHeight: 330,
    marginRight: 15,
  },
  title: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 10
  }
})

export default Relay.createContainer(ArtistRail, {
  initialVariables: {
    fetchContent: false,
  },

  fragments: {
    rail: () => Relay.QL`
      fragment on HomePageArtistModule {
        __id
        key
        results @include(if: $fetchContent) {
          _id
          __id
          ${ArtistCard.getFragment('artist')}
        }
      }
    `,
  }
})

function suggestedArtistQuery(artist_id: string): string {
  return `
    query {
      me {
        suggested_artists(artist_id: "${artist_id}",
                          size: 1,
                          exclude_followed_artists: true,
                          exclude_artists_without_forsale_artworks: true) {
          _id
          __id
          ${ArtistCard.artistQuery}
        }
      }
    }
  `
}
