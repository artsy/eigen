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
  ViewProperties,
  ViewStyle,
} from "react-native"

const { ARTemporaryAPIModule } = NativeModules

import Events from "lib/NativeModules/Events"

import Button from "lib/Components/Buttons/InvertedButton"
import SerifText from "lib/Components/Text/Serif"
import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import SectionTitle from "../../SectionTitle"

const isPad = Dimensions.get("window").width > 700

const additionalContentRails = [
  "followed_artists",
  "saved_works",
  "live_auctions",
  "current_fairs",
  "genes",
  "generic_gene",
]

interface Props extends ViewProperties, RelayProps {
  handleViewAll: () => void
}

interface State {
  following: boolean
}

class ArtworkCarouselHeader extends Component<Props & RelayPropsWorkaround, State> {
  constructor(props) {
    super(props)
    this.state = { following: props.rail.key === "followed_artist" }
  }

  render() {
    // FIXME: For some reason this.props.rail.title existence triggers a "Can only update a
    // mounted or mounting component" error. Only happens when mounted from ArtworkCarousel.
    // Doesn't break app, but potentially breaking. Maybe some kind of hidden state within
    // SectionTitle text component?
    return (
      <TouchableWithoutFeedback onPress={this.props.handleViewAll}>
        <View style={styles.container}>
          <SectionTitle>
            {this.props.rail.title}
          </SectionTitle>
          {this.props.rail.context && this.followAnnotation()}
          {this.actionButton()}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  followAnnotation() {
    if (this.props.rail.key === "related_artists") {
      const name = this.props.rail.context.based_on.name
      return (
        <SerifText style={styles.followAnnotation}>
          {"Based on " + name}
        </SerifText>
      )
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
            onPress={this.handleFollowChange}
          />
        </View>
      )
    }
  }

  handleFollowChange = () => {
    const context = this.props.rail.context
    ARTemporaryAPIModule.setFollowArtistStatus(!this.state.following, context.artist.id, (error, following) => {
      if (error) {
        console.error("ArtworkCarouselHeader.tsx", error)
      } else {
        Events.postEvent({
          name: following ? "Follow artist" : "Unfollow artist",
          artist_id: context.artist.id,
          artist_slug: context.artist.id,
          source_screen: "home page",
          context_module: "random suggested artist",
        })
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
        ... on HomePageModuleContextRelatedArtist {
          artist {
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

interface RelayProps {
  rail: {
    title: string | null
    key: string | null
    context: Array<boolean | number | string | null> | null
  }
}
interface RelayPropsWorkaround {
  rail: {
    context: any
  }
}
