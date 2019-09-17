// TODO: This file still has a bunch of faffing with rendering a relay based version of ArtistCard and a plain React
//       version. In reality it should be updated to never render the React component but instead update the store and
//       let Relay re-render the cards.

import React, { Component } from "react"
import { Animated, Easing, ScrollView, StyleSheet, TextStyle, View, ViewProperties, ViewStyle } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

import { Schema, Track, track as _track } from "lib/utils/track"
import Separator from "../../Separator"
import Spinner from "../../Spinner"
import SectionTitle from "../SectionTitle"
import { ArtistCard, ArtistCardContainer } from "./ArtistCard"

import { ArtistCard_artist } from "__generated__/ArtistCard_artist.graphql"
import { ArtistRail_rail } from "__generated__/ArtistRail_rail.graphql"
import { ArtistRailFollowMutation } from "__generated__/ArtistRailFollowMutation.graphql"
import Events from "lib/NativeModules/Events"
import { defaultEnvironment } from "lib/relay/createEnvironment"

const Animation = {
  yDelta: 20,
  duration: {
    followedArtist: 500,
    suggestedArtist: 400,
  },
  easing: Easing.out(Easing.cubic),
}

interface Props extends ViewProperties {
  relay: RelayProp
  rail: ArtistRail_rail
}

interface State {
  artists: SuggestedArtist[]
}
// FIXME: can remove "trackWithArguments" when the third arguments parameter is added to the typings of react-tracking
const track: Track<Props, State> = _track
const trackWithArguments: any = _track

@track()
export class ArtistRail extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    if (props.rail.results) {
      const artists = props.rail.results.map(({ id, internalID }) =>
        setupSuggestedArtist({ id, internalID }, 1, 0)
      ) as any
      this.state = { artists }
    }
  }

  followedArtistAnimation(followedArtist) {
    return new Promise((resolve, _reject) => {
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
    return new Promise((resolve, _reject) => {
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

  @trackWithArguments((_props, _state, [followArtist]) => ({
    action_name: Schema.ActionNames.HomeArtistRailFollow,
    action_type: Schema.ActionTypes.Tap,
    owner_id: followArtist.internalID,
    owner_slug: followArtist.id,
    owner_type: Schema.OwnerEntityTypes.Artist,
  }))
  handleFollowChange(followArtist: SuggestedArtist, completionHandler: (followStatus: boolean) => void) {
    return (
      new Promise<SuggestedArtist | null>((resolve, reject) => {
        commitMutation<ArtistRailFollowMutation>(defaultEnvironment, {
          mutation: graphql`
            mutation ArtistRailFollowMutation($input: FollowArtistInput!, $excludeArtistIDs: [String]!) {
              followArtist(input: $input) {
                artist {
                  related {
                    suggestedConnection(
                      first: 1
                      excludeArtistIDs: $excludeArtistIDs
                      excludeFollowedArtists: true
                      excludeArtistsWithoutForsaleArtworks: true
                    ) {
                      edges {
                        node {
                          ...ArtistCard_artist @relay(mask: false)
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: {
            input: { artistID: followArtist.internalID },
            excludeArtistIDs: this.state.artists.map(({ internalID }) => internalID),
          },
          onError: reject,
          onCompleted: (response, errors) => {
            if (errors && errors.length > 0) {
              reject(new Error(JSON.stringify(errors)))
            } else {
              Events.postEvent({
                name: "Follow artist",
                artist_id: followArtist.internalID,
                artist_slug: followArtist.slug,
                // TODO: At some point, this component might be on other screens.
                source_screen: "home page",
                context_module: "artist rail",
              })

              completionHandler(true)

              const [edge] = response.followArtist.artist.related.suggestedConnection.edges
              resolve(edge ? setupSuggestedArtist(edge.node, 0, -Animation.yDelta) : null)
            }
          },
        })
      })
        // Animate the followed artist card away.
        .then(suggestion => this.followedArtistAnimation(followArtist).then(() => suggestion))
        // Replace the followed artist by the suggested one in the list of artists.
        .then(suggestion => this.replaceFollowedArtist(followArtist, suggestion).then(() => suggestion))
        // Finally animate the suggested artist card in, if there is a suggestion.
        .then(suggestion => suggestion && this.suggestedArtistAnimation(suggestion))
        .catch(error => {
          console.warn(error)
          completionHandler(false)
        })
    )
  }

  renderModuleResults() {
    if (this.state.artists.length > 0) {
      const cards = this.state.artists.map(artist => {
        // Compose key, because an artist may appear twice on the home view in different modules.
        const key = this.props.rail.id + artist.id
        const { opacity, translateY } = artist._animatedValues
        const style = { opacity, transform: [{ translateY }] }
        return (
          <Animated.View key={key} style={style}>
            {artist.hasOwnProperty("__fragments") ? (
              <ArtistCardContainer
                artist={artist as any}
                onFollow={completionHandler => this.handleFollowChange(artist, completionHandler)}
              />
            ) : (
              <ArtistCard
                artist={artist as any}
                onFollow={completionHandler => this.handleFollowChange(artist, completionHandler)}
              />
            )}
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
      return <Spinner style={{ flex: 1, marginBottom: 20 }} />
    }
  }

  title() {
    return "Artists to Follow:"
  }
  subtitle() {
    switch (this.props.rail.key) {
      case "TRENDING":
        return "Trending on Artsy"
      case "SUGGESTED":
        return "Recommended for You"
      case "POPULAR":
        return "Popular on Artsy"
    }
  }

  render() {
    if (!this.state.artists.length) {
      return null
    }

    return (
      <View>
        <View style={styles.title}>
          <SectionTitle>{this.title()}</SectionTitle>
          <SectionTitle style={styles.subtitle}>{this.subtitle()}</SectionTitle>
        </View>
        {this.renderModuleResults()}
        <Separator />
      </View>
    )
  }
}

const setupSuggestedArtist = (artist, opacity, translateY) =>
  ({
    ...artist,
    _animatedValues: {
      opacity: new Animated.Value(opacity),
      translateY: new Animated.Value(translateY),
    },
  } as SuggestedArtist)

interface Styles {
  cardContainer: ViewStyle
  title: ViewStyle
  subtitle: TextStyle
}

const styles = StyleSheet.create<Styles>({
  cardContainer: {
    flexGrow: 1,
    flexDirection: "row",
    marginTop: 10,
    minHeight: 320,
  },
  title: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "AGaramondPro-Regular",
  },
})

interface SuggestedArtist extends Pick<ArtistCard_artist, Exclude<keyof ArtistCard_artist, " $refType">> {
  // id: string
  _animatedValues?: {
    opacity: Animated.Value
    translateY: Animated.Value
  }
}

export default createFragmentContainer(ArtistRail, {
  rail: graphql`
    fragment ArtistRail_rail on HomePageArtistModule {
      id
      key
      results {
        id
        internalID
        ...ArtistCard_artist
      }
    }
  `,
})
