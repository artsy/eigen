import React, { Component } from "react"
import { createFragmentContainer, graphql } from "react-relay"

import {
  Dimensions,
  NativeModules,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native"

const { ARTemporaryAPIModule } = NativeModules

import { Button } from "@artsy/palette"
import SerifText from "lib/Components/Text/Serif"
import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import { Schema, Track, track as _track } from "lib/utils/track"
import SectionTitle from "../../SectionTitle"

import { ArtworkCarouselHeader_rail } from "__generated__/ArtworkCarouselHeader_rail.graphql"

const isPad = Dimensions.get("window").width > 700

const additionalContentRails = [
  "followed_artists",
  "saved_works",
  "live_auctions",
  "current_fairs",
  "genes",
  "generic_gene",
]

interface Props {
  rail: ArtworkCarouselHeader_rail
  handleViewAll: () => void
}

interface State {
  following: boolean
}

const track: Track<Props, State> = _track

@track()
class ArtworkCarouselHeader extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { following: props.rail.key === "followed_artist" }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.handleViewAll}>
        <View style={styles.container}>
          <SectionTitle>{this.props.rail.title}</SectionTitle>
          {this.followAnnotation()}
          {this.actionButton()}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  followAnnotation() {
    const context = this.props.rail.context
    if (context && context.__typename === "HomePageRelatedArtistArtworkModule") {
      return <SerifText style={styles.followAnnotation}>{`Based on ${context.based_on.name}`}</SerifText>
    }
  }

  hasAdditionalContent() {
    const moduleKey = this.props.rail.key
    return additionalContentRails.indexOf(moduleKey) > -1
  }

  actionButton() {
    if (this.hasAdditionalContent()) {
      return (
        <Text style={styles.viewAllButton}>
          {""}
          {"View All".toUpperCase()}{" "}
        </Text>
      )
    } else if (this.props.rail.key === "related_artists" || this.props.rail.key === "followed_artist") {
      return (
        <View style={styles.followButton}>
          <Button
            variant={this.state.following ? "secondaryOutline" : "primaryBlack"}
            onPress={this.handleFollowChange.bind(this)}
            longestText="Following"
            size="small"
          >
            {this.state.following ? "Following" : "Follow"}
          </Button>
        </View>
      )
    }
  }

  @track(props => {
    const artist = getSubjectArtist(props)
    return {
      action_name: Schema.ActionNames.HomeArtistArtworksBlockFollow,
      action_type: Schema.ActionTypes.Tap,
      owner_id: artist.internalID,
      owner_slug: artist.slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    }
  })
  handleFollowChange() {
    const artist = getSubjectArtist(this.props)
    ARTemporaryAPIModule.setFollowArtistStatus(!this.state.following, artist.slug, (error, following) => {
      if (error) {
        console.error("ArtworkCarouselHeader.tsx", error)
      }
      this.setState({ following })
    })
  }
}

export function getSubjectArtist(props: Props) {
  const context = props.rail.context
  if (
    context &&
    (context.__typename === "HomePageFollowedArtistArtworkModule" ||
      context.__typename === "HomePageRelatedArtistArtworkModule")
  ) {
    return context.artist
  }
  return null
}

interface Styles {
  container: ViewStyle
  viewAllButton: TextStyle
  followButton: ViewStyle
  followAnnotation: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    marginTop: isPad ? 40 : 30,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  viewAllButton: {
    fontFamily: fonts["avant-garde-regular"],
    fontSize: isPad ? 14 : 12,
    color: colors["gray-medium"],
    letterSpacing: 0.5,
    padding: 0,
    marginTop: -5,
  },
  followButton: {
    marginTop: 5,
    marginBottom: 0,
  },
  followAnnotation: {
    fontSize: 20,
  },
})

export default createFragmentContainer(ArtworkCarouselHeader, {
  rail: graphql`
    fragment ArtworkCarouselHeader_rail on HomePageArtworkModule {
      title
      key
      context {
        __typename
        ... on HomePageFollowedArtistArtworkModule {
          artist {
            internalID
            slug
          }
        }
        ... on HomePageRelatedArtistArtworkModule {
          artist {
            internalID
            slug
          }
          based_on: basedOn {
            name
          }
        }
      }
    }
  `,
})
