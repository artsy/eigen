import * as React from "react"
import * as Relay from "react-relay"

import { Animated, Easing, ScrollView, StyleSheet, View, ViewProperties, ViewStyle } from "react-native"

import metaphysics from "../../../metaphysics"

import Separator from "../../separator"
import Spinner from "../../spinner"
import SectionTitle from "../section_title"
import ArtistCard, { ArtistCardQuery, ArtistCardResponse, ArtistFollowButtonStatusSetter } from "./artist_card"

const Animation = {
  yDelta: 20,
  duration: {
    followedArtist: 500,
    suggestedArtist: 400,
  },
  easing: Easing.out(Easing.cubic),
}

interface Props extends ViewProperties, RelayProps {
  relay: Relay.RelayProp
}

interface State {
  artists: any[]
  loadFailed: boolean
}

class ArtistRail extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      artists: [],
      loadFailed: false,
    }
  }

  componentDidMount() {
    if (this.props.relay) {
      this.props.relay.setVariables({ fetchContent: true }, readyState => {
        if (readyState.error) {
          this.setState({ loadFailed: true })
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rail.results) {
      const artists = nextProps.rail.results
      artists.forEach(artist => {
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
        Animated.timing(opacity, { duration, easing, toValue: 0 }),
        Animated.timing(translateY, { duration, easing, toValue: Animation.yDelta }),
      ]).start(resolve)
    })
  }

  suggestedArtistAnimation(suggestedArtist: SuggestedArtist) {
    return new Promise((resolve, reject) => {
      const { opacity, translateY } = suggestedArtist._animatedValues
      const duration = Animation.duration.suggestedArtist
      const easing = Animation.easing
      Animated.parallel([
        Animated.timing(opacity, { duration, easing, toValue: 1 }),
        Animated.timing(translateY, { duration, easing, toValue: 0 }),
      ]).start(resolve)
    })
  }

  replaceFollowedArtist(followedArtist, suggestedArtist: SuggestedArtist): Promise<undefined> {
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
    // Resolve after re-render
    return new Promise((resolve, _) => {
      this.setState({ artists }, resolve)
    })
  }

  handleFollowChange(followArtist, setFollowButtonStatus: ArtistFollowButtonStatusSetter) {
    // Get a new suggested artist based on the followed artist.
    return (
      metaphysics<SuggestedArtistResponse>(suggestedArtistQuery(followArtist._id))
        // Return the suggested artist or `undefined` if there is no suggestion.
        .then(({ me: { suggested_artists } }) => suggested_artists[0])
        // Return `undefined` if an error occurred.
        .catch(error => console.error(error))
        // Change the status of the follow button to ‘following’.
        .then<SuggestedArtist>(suggestedArtist => setFollowButtonStatus(true).then(() => suggestedArtist))
        // Animate the followed artist card away.
        .then(suggestedArtist => this.followedArtistAnimation(followArtist).then(() => suggestedArtist))
        // Replace the followed artist by the suggested one in the list of artists.
        .then(suggestedArtist => this.replaceFollowedArtist(followArtist, suggestedArtist).then(() => suggestedArtist))
        // Finally animate the suggested artist card in, if there is a suggestion.
        .then(suggestedArtist => suggestedArtist && this.suggestedArtistAnimation(suggestedArtist))
    )
  }

  renderModuleResults() {
    if (this.state.artists.length > 0) {
      const cards = this.state.artists.map(artist => {
        // Compose key, because an artist may appear twice on the home view in different modules.
        const key = this.props.rail.__id + artist.__id
        const { opacity, translateY } = artist._animatedValues
        const style = { opacity, transform: [{ translateY }] }
        return (
          <Animated.View key={key} style={style}>
            <ArtistCard artist={artist} onFollow={setter => this.handleFollowChange(artist, setter)} />
          </Animated.View>
        )
      })
      return (
        <ScrollView
          style={styles.cardContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollsToTop={false}
        >
          {cards}
          {
            // Adding a spacer view to have padding at the end of the rail
            // If you add marginRight, it will cut off the cards as you scroll through
          }
          <View style={{ width: 15 }} />
        </ScrollView>
      )
    } else {
      return <Spinner style={{ flex: 1 }} />
    }
  }

  title() {
    switch (this.props.rail.key) {
      case "TRENDING":
        return "Artists to Follow: Trending"
      case "SUGGESTED":
        return "Artists to Follow: Recommended for You"
      case "POPULAR":
        return "Artists to Follow: Popular"
    }
  }

  render() {
    if (this.state.loadFailed) {
      return null
    }

    return (
      <View>
        <View style={styles.title}><SectionTitle>{this.title()}</SectionTitle></View>
        {this.renderModuleResults()}
        <Separator />
      </View>
    )
  }
}

interface Styles {
  cardContainer: ViewStyle
  title: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  cardContainer: {
    flexGrow: 1,
    flexDirection: "row",
    marginTop: 10,
    minHeight: 330,
  },
  title: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 40,
    marginBottom: 10,
  },
})

interface SuggestedArtist extends ArtistCardResponse {
  _id: string
  __id: string
  _animatedValues?: {
    opacity: Animated.Value
    translateY: Animated.Value
  }
}

interface SuggestedArtistResponse {
  me: {
    suggested_artists: SuggestedArtist[]
  }
}

function suggestedArtistQuery(artistID: string): string {
  return `
    query {
      me {
        suggested_artists(artist_id: "${artistID}",
                          size: 1,
                          exclude_followed_artists: true,
                          exclude_artists_without_forsale_artworks: true) {
          _id
          __id
          ${ArtistCardQuery}
        }
      }
    }
  `
}

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
          ${ArtistCard.getFragment("artist")}
        }
      }
    `,
  },
})

interface RelayProps {
  rail: {
    __id: string
    key: string | null
    results: Array<{
      _id: string
      __id: string
    } | null> | null
  }
}
