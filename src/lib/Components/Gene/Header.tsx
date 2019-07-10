import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { Dimensions, NativeModules, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
const { ARTemporaryAPIModule } = NativeModules

import { Schema, Track, track as _track } from "../../utils/track"

import InvertedButton from "../Buttons/InvertedButton"
import Headline from "../Text/Headline"

import { Header_gene } from "__generated__/Header_gene.graphql"

interface Props {
  gene: Header_gene
  shortForm: boolean
}

interface State {
  following: boolean | null
}

const track: Track<Props, State> = _track

@track()
class Header extends React.Component<Props, State> {
  state = { following: null }

  componentDidMount() {
    NativeModules.ARTemporaryAPIModule.followStatusForGene(this.props.gene.internalID, (error, following) => {
      if (error) {
        // FIXME: Handle error
        console.error("Gene/Header.tsx", error.message)
      }
      this.setState({ following })
    })
  }

  render() {
    const gene = this.props.gene
    return (
      <View>
        <View style={styles.header}>
          <Headline style={styles.headline} numberOfLines={2}>
            {gene.name}
          </Headline>
        </View>
        {this.renderFollowButton()}
      </View>
    )
  }

  @track((props, state) => ({
    action_name: state.following ? Schema.ActionNames.GeneUnfollow : Schema.ActionNames.GeneFollow,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.gene.internalID,
    owner_slug: props.gene.slug,
    owner_type: Schema.OwnerEntityTypes.Gene,
  }))
  handleFollowChange() {
    ARTemporaryAPIModule.setFollowGeneStatus(!this.state.following, this.props.gene.internalID, (error, following) => {
      if (error) {
        console.warn(error)
        this.failedFollowChange()
      } else {
        this.successfulFollowChange()
      }
      this.setState({ following })
    })
    this.setState({ following: !this.state.following })
  }

  @track((props, state) => ({
    action_name: state.following ? Schema.ActionNames.GeneFollow : Schema.ActionNames.GeneUnfollow,
    action_type: Schema.ActionTypes.Success,
    owner_id: props.gene.internalID,
    owner_slug: props.gene.slug,
    owner_type: Schema.OwnerEntityTypes.Gene,
  }))
  successfulFollowChange() {
    // callback for analytics purposes
  }

  @track((props, state) => ({
    action_name: state.following ? Schema.ActionNames.GeneFollow : Schema.ActionNames.GeneUnfollow,
    action_type: Schema.ActionTypes.Fail,
    owner_id: props.gene.internalID,
    owner_slug: props.gene.slug,
    owner_type: Schema.OwnerEntityTypes.Gene,
  }))
  failedFollowChange() {
    // callback for analytics purposes
  }

  renderFollowButton() {
    if (this.props.shortForm) {
      return null
    }
    if (this.state.following !== null) {
      return (
        <View style={styles.followButton}>
          <InvertedButton
            text={this.state.following ? "Following" : "Follow"}
            selected={this.state.following}
            onPress={this.handleFollowChange.bind(this)}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.followButton}>
          <InvertedButton text="" onPress={this.handleFollowChange.bind(this)} />
        </View>
      )
    }
  }
}

const isPad = Dimensions.get("window").width > 700

interface Styles {
  header: TextStyle
  headline: TextStyle
  followButton: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  header: {
    marginTop: 15,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 40,
    paddingRight: 40,
  },
  headline: {
    textAlign: "center",
    fontSize: isPad ? 20 : 14,
  },
  followButton: {
    height: 40,
    marginTop: 30,
  },
})

export default createFragmentContainer(Header, {
  gene: graphql`
    fragment Header_gene on Gene {
      internalID
      slug
      name
    }
  `,
})
