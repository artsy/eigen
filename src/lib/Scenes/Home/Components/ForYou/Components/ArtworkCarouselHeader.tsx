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
    const context = this.props.rail.relatedArtistContext
    if (context && context.based_on) {
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
  return props.rail.followedArtistContext.artist || props.rail.relatedArtistContext.artist
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
      # This aliasing selection of the context is done to work around a type generator bug, see below.
      followedArtistContext: context {
        ... on HomePageFollowedArtistArtworkModule {
          artist {
            internalID
            slug
          }
        }
      }
      relatedArtistContext: context {
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
      # FIXME: There is a bug in the Relay transformer used before generating Flow types, and thus also our TS type
      #        generator, that leads to a union selection _with_ a __typename selection being normalized incorrectly.
      #        What ends up happening is that _only_ the common selection is being omitted from the second fragment,
      #        i.e. in this case the artist selection is not present in the second fragment.
      #
      #        This can be seen much more clear when adding __typename to the context part in ArtworkRail.tsx.
      #
      # context {
      #   __typename
      #   ... on HomePageModuleContextFollowedArtist {
      #     artist {
      #       internalID
      #       id
      #     }
      #   }
      #   ... on HomePageModuleContextRelatedArtist {
      #     artist {
      #       internalID
      #       id
      #     }
      #     based_on {
      #       name
      #     }
      #   }
      # }
    }
  `,
})
