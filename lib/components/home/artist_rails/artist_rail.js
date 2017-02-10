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
    artists: any[],
    loadFailed: boolean
  }

  constructor(props) {
    super(props)
    this.state = {
      artists: [],
      loadFailed: false,
    }
  }

  componentDidMount() {
    this.props.relay.setVariables({ fetchContent: true }, readyState => {
      if (readyState.error) {
        this.setState({ loadFailed: true })
      }
    })
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

  handleFollowChange(followedArtist, setFollowButtonStatus) {
      // Get a new suggested artist based on the followed artist.
    return metaphysics(suggestedArtistQuery(followedArtist._id))
      // Return the suggested artist or `undefined` if there is no suggestion.
      .then(({ me: { suggested_artists }}) => suggested_artists[0])
      // Return `undefined` if an error occurred.
      .catch(error => console.error(error))
      // Change the status of the follow button to ‘following’ and return the suggestion.
      .then((suggestedArtist) => setFollowButtonStatus(true).then(() => suggestedArtist))
      // Animate the followed artist card away and return the suggestion.
      .then((suggestedArtist) => this.followedArtistAnimation(followedArtist).then(() => suggestedArtist))
      // Replace the followed artist by the suggested one in the list of artists and return the suggestion.
      .then((suggestedArtist) => this.replaceFollowedArtist(followedArtist, suggestedArtist))
      // Finally animate the suggested artist card in, if there is a suggestion.
      .then((suggestedArtist) => suggestedArtist && this.suggestedArtistAnimation(suggestedArtist))
  }

  renderModuleResults() {
    if (this.state.artists.length > 0) {
      const cards = this.state.artists.map(artist => {
        // Compose key, because an artist may appear twice on the home view in different modules.
        const key = this.props.rail.__id + artist.__id
        const { opacity, translateY } = artist._animatedValues
        const style = { opacity, transform: [{ translateY }] }
        const followHandler = (setFollowButtonStatus) => this.handleFollowChange(artist, setFollowButtonStatus)
        return (
          <Animated.View key={key} style={style}>
            <ArtistCard artist={artist} onFollow={followHandler} />
          </Animated.View>
        )
      })
      return (
        <ScrollView style={styles.cardContainer}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollsToTop={false}>
          {cards}
          {
            // Adding a spacer view to have padding at the end of the rail
            // If you add marginRight, it will cut off the cards as you scroll through
          }
          <View style={{width:15}} />
        </ScrollView>
      )
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
    if (this.state.loadFailed) {
      return null
    }

    return (
      <View>
        <View style={styles.title}><SectionTitle>{ this.title() }</SectionTitle></View>
        {this.renderModuleResults()}
      <Separator/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    marginTop: 10,
    minHeight: 330,
 },
  title: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 40,
    marginBottom: 10,
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
