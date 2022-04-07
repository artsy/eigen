import { Header_gene } from "__generated__/Header_gene.graphql"
import { HeaderFollowGeneMutation } from "__generated__/HeaderFollowGeneMutation.graphql"
import { Box, FollowButton, Sans } from "palette"
import React from "react"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { Schema, Track, track as _track } from "../../utils/track"

interface Props {
  gene: Header_gene
  shortForm: boolean
  relay: RelayProp
}

interface State {
  isFollowedChanging: boolean
}

const track: Track<Props, State> = _track

@track()
class Header extends React.Component<Props, State> {
  state = { isFollowedChanging: false }

  render() {
    const { gene } = this.props
    return (
      <>
        <Box marginTop={60} justifyContent="center">
          <Sans size="8" numberOfLines={2}>
            {gene.name || ""}
          </Sans>
        </Box>
        {this.renderFollowButton()}
      </>
    )
  }

  @track((props) => ({
    action_name: props.gene.isFollowed
      ? Schema.ActionNames.GeneUnfollow
      : Schema.ActionNames.GeneFollow,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.gene.internalID,
    owner_slug: props.gene.slug,
    owner_type: Schema.OwnerEntityTypes.Gene,
  }))
  handleFollowChange() {
    const {
      relay,
      gene: { slug, id, isFollowed },
    } = this.props
    const { isFollowedChanging } = this.state

    if (isFollowedChanging) {
      return
    }

    this.setState(
      {
        isFollowedChanging: true,
      },
      () => {
        commitMutation<HeaderFollowGeneMutation>(relay.environment, {
          onCompleted: () => this.successfulFollowChange(),
          mutation: graphql`
            mutation HeaderFollowGeneMutation($input: FollowGeneInput!) {
              followGene(input: $input) {
                gene {
                  id
                  isFollowed
                }
              }
            }
          `,
          variables: {
            input: {
              geneID: slug,
              unfollow: isFollowed,
            },
          },
          // @ts-ignore RELAY 12 MIGRATION
          optimisticResponse: {
            followGene: {
              gene: {
                id,
                isFollowed: !isFollowed,
              },
            },
          },
          updater: (store) => {
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            store.get(id).setValue(!isFollowed, "isFollowed")
          },
          onError: () => this.failedFollowChange(),
        })
      }
    )
  }

  @track((props) => ({
    action_name: props.gene.isFollowed
      ? Schema.ActionNames.GeneFollow
      : Schema.ActionNames.GeneUnfollow,
    action_type: Schema.ActionTypes.Success,
    owner_id: props.gene.internalID,
    owner_slug: props.gene.slug,
    owner_type: Schema.OwnerEntityTypes.Gene,
  }))
  successfulFollowChange() {
    // callback for analytics purposes
    this.setState({
      isFollowedChanging: false,
    })
  }

  @track((props) => ({
    action_name: props.gene.isFollowed
      ? Schema.ActionNames.GeneFollow
      : Schema.ActionNames.GeneUnfollow,
    action_type: Schema.ActionTypes.Fail,
    owner_id: props.gene.internalID,
    owner_slug: props.gene.slug,
    owner_type: Schema.OwnerEntityTypes.Gene,
  }))
  failedFollowChange() {
    // callback for analytics purposes
    this.setState({
      isFollowedChanging: false,
    })
  }

  renderFollowButton() {
    if (this.props.shortForm) {
      return null
    }
    const { gene } = this.props

    return (
      <Box mt={15}>
        <FollowButton
          block
          isFollowed={!!gene.isFollowed}
          onPress={() => this.handleFollowChange()}
        />
      </Box>
    )
  }
}

export default createFragmentContainer(Header, {
  gene: graphql`
    fragment Header_gene on Gene {
      internalID
      slug
      id
      isFollowed
      name
    }
  `,
})
