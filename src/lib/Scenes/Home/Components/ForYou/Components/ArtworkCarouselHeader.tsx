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

import { Schema, Track, track as _track } from "lib/utils/track"

import Button from "lib/Components/Buttons/InvertedButton"
import SerifText from "lib/Components/Text/Serif"
import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
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
          {this.props.rail.context && this.followAnnotation()}
          {this.actionButton()}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  followAnnotation() {
    if (this.props.rail.context.__typename === "HomePageModuleContextRelatedArtist") {
      const name = this.props.rail.context.based_on.name
      return <SerifText style={styles.followAnnotation}>{"Based on " + name}</SerifText>
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
            text={this.state.following ? "Following" : "Follow"}
            selected={this.state.following}
            onPress={this.handleFollowChange.bind(this)}
          />
        </View>
      )
    }
  }

  // FIXME: There is some bug here either in our TS language plugin or worse in Relay. Even though we query for `artist`
  //        in `HomePageModuleContextRelatedArtist`, it does not appear in ArtworkCarouselHeader_rail.graphql.ts
  //
  //        This can be seen much more clear when adding `__typename` to the `context` part in `ArtworkRail.tsx`.
  //
  @track(props => ({
    action_name: Schema.ActionNames.HomeArtistArtworksBlockFollow,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.rail.context.artist._id,
    owner_slug: props.rail.context.artist.id,
    owner_type: Schema.OwnerEntityTypes.Artist,
  }))
  handleFollowChange() {
    const context = this.props.rail.context
    ARTemporaryAPIModule.setFollowArtistStatus(!this.state.following, context.artist.id, (error, following) => {
      if (error) {
        console.error("ArtworkCarouselHeader.tsx", error)
      }
      this.setState({ following })
    })
  }
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
    height: 30,
    width: 90,
  },
  followAnnotation: {
    fontSize: 20,
  },
})

export default createFragmentContainer(
  ArtworkCarouselHeader,
  graphql`
    fragment ArtworkCarouselHeader_rail on HomePageArtworkModule {
      title
      key
      context {
        __typename
        ... on HomePageModuleContextFollowedArtist {
          artist {
            _id
            id
          }
        }
        ... on HomePageModuleContextRelatedArtist {
          artist {
            _id
            id
          }
          based_on {
            name
          }
        }
      }
    }
  `
)
