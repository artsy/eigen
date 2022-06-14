import { ContextCard_artwork$data } from "__generated__/ContextCard_artwork.graphql"
import { ContextCardFollowMutation } from "__generated__/ContextCardFollowMutation.graphql"
import { navigate } from "app/navigation/navigate"
import { Schema, Track, track as _track } from "app/utils/track"
import { Box, EntityHeader, Flex, FollowButton, Sans } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface ContextCardProps {
  artwork: ContextCard_artwork$data
  relay: RelayProp
}

interface ContextCardState {
  isSaving: boolean
}

type Show = Extract<NonNullable<ContextCard_artwork$data["context"]>, { __typename: "Show" }>

const track: Track<ContextCardProps, ContextCardState> = _track as any

@track()
export class ContextCard extends React.Component<ContextCardProps, ContextCardState> {
  state = {
    isSaving: false,
  }

  handleFollowShow = (show: Show) => {
    const { relay } = this.props
    const { slug, id, internalID, isFollowed } = show
    this.setState(
      {
        isSaving: true,
      },
      () => {
        commitMutation<ContextCardFollowMutation>(relay.environment, {
          onCompleted: () => this.handleShowSuccessfullyUpdated(),
          mutation: graphql`
            mutation ContextCardFollowMutation($input: FollowShowInput!) {
              followShow(input: $input) {
                show {
                  slug
                  internalID
                  isFollowed
                  id
                }
              }
            }
          `,
          variables: {
            input: {
              partnerShowID: internalID,
              unfollow: isFollowed,
            },
          },
          // @ts-ignore RELAY 12 MIGRATION
          optimisticResponse: {
            followShow: {
              show: {
                internalID,
                isFollowed: !isFollowed,
                slug,
                id,
              },
            },
          },
          updater: (store) => {
            store.get(id)?.setValue(!isFollowed, "isFollowed")
          },
        })
      }
    )
  }

  @track((_props, _state, args) => {
    const show = args[0]
    return {
      action_name: show.isFollowed ? Schema.ActionNames.UnsaveShow : Schema.ActionNames.SaveShow,
      action_type: Schema.ActionTypes.Success,
      owner_id: show.internalID,
      owner_slug: show.gravityID,
      owner_type: Schema.OwnerEntityTypes.Show,
    } as any
  })
  handleShowSuccessfullyUpdated() {
    this.setState({
      isSaving: false,
    })
  }

  onSaveStarted = () => {
    this.setState({
      isSaving: true,
    })
  }

  onSaveEnded = () => {
    this.setState({
      isSaving: false,
    })
  }

  followButton = (show: Show) => {
    const { isFollowed } = show

    return (
      <FollowButton haptic isFollowed={!!isFollowed} onPress={() => this.handleFollowShow(show)} />
    )
  }

  render() {
    let meta = null
    let header = ""
    let imageUrl = ""
    let followButton = null

    const { artwork } = this.props
    const { context } = artwork

    // Don't display a context card ever if the work is in a non-auction sale as the existing
    // sale page is not built for this purpose.
    if (context && context.__typename === "Sale" && context.isAuction === false) {
      return null
    }

    if (context) {
      switch (context.__typename) {
        case "Sale":
          header = "In auction"
          meta = context.formattedStartDateTime
          imageUrl = context.coverImage && context.coverImage.url ? context.coverImage.url : ""
          break
        case "Fair":
          header = "In fair"
          meta = context.exhibitionPeriod
          imageUrl = context.image && context.image.url ? context.image.url : ""
          break
        case "Show":
          header = "In show"
          meta = context.exhibitionPeriod
          imageUrl = context.coverImage && context.coverImage.url ? context.coverImage.url : ""
          followButton = this.followButton(context)
          break
        default:
          return null
      }
    } else {
      return null
    }

    return (
      <>
        <Box mb={2}>
          <Sans size="3t" weight="medium" color="black100">
            {header}
          </Sans>
        </Box>
        <Flex>
          <TouchableWithoutFeedback onPress={() => navigate(context.href!)}>
            <EntityHeader
              name={context.name!}
              href={context.href || undefined}
              meta={meta || undefined}
              imageUrl={imageUrl || undefined}
              FollowButton={followButton || undefined}
            />
          </TouchableWithoutFeedback>
        </Flex>
      </>
    )
  }
}

export const ContextCardFragmentContainer = createFragmentContainer(ContextCard, {
  artwork: graphql`
    fragment ContextCard_artwork on Artwork {
      id
      context {
        __typename
        ... on Sale {
          id
          name
          isLiveOpen
          href
          formattedStartDateTime
          isAuction
          coverImage {
            url
          }
        }
        ... on Fair {
          id
          name
          href
          exhibitionPeriod(format: SHORT)
          image {
            url
          }
        }
        ... on Show {
          id
          internalID
          slug
          name
          href
          exhibitionPeriod(format: SHORT)
          isFollowed
          coverImage {
            url
          }
        }
      }
    }
  `,
})
