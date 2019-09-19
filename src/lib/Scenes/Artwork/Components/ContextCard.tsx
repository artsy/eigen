import { Box, Button, EntityHeader, Flex, Sans } from "@artsy/palette"
import { ContextCard_artwork } from "__generated__/ContextCard_artwork.graphql"
import { ContextCardFollowMutation } from "__generated__/ContextCardFollowMutation.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, Track, track as _track } from "lib/utils/track"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface ContextCardProps {
  artwork: ContextCard_artwork
  relay: RelayProp
}

interface ContextCardState {
  isSaving: boolean
}

const track: Track<ContextCardProps, ContextCardState> = _track

@track()
export class ContextCard extends React.Component<ContextCardProps, ContextCardState> {
  state = {
    isSaving: false,
  }

  handleFollowShow = show => {
    const { relay } = this.props
    const { slug, id, internalID, isFollowed } = show
    this.setState(
      {
        isSaving: true,
      },
      () => {
        commitMutation<ContextCardFollowMutation>(relay.environment, {
          onCompleted: () => this.handleShowSuccessfullyUpdated(show),
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
          updater: store => {
            store.get(id).setValue(!isFollowed, "isFollowed")
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
  handleShowSuccessfullyUpdated(_show) {
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

  handleTap(context: any, href: string) {
    SwitchBoard.presentNavigationViewController(context, href)
  }

  followButton = show => {
    const { isFollowed } = show
    const { isSaving } = this.state

    return (
      <Button
        variant={isFollowed ? "secondaryOutline" : "primaryBlack"}
        onPress={() => this.handleFollowShow(show)}
        size="small"
        longestText="Following"
        loading={isSaving}
      >
        {isFollowed ? "Following" : "Follow"}
      </Button>
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
          meta = context.isLiveOpen ? "In progress" : context.formattedStartDateTime
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
          <TouchableWithoutFeedback onPress={() => this.handleTap(this, context.href)}>
            <EntityHeader
              name={context.name}
              href={context.href}
              meta={meta}
              imageUrl={imageUrl}
              initials={null}
              FollowButton={followButton}
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
          exhibitionPeriod
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
          exhibitionPeriod
          isFollowed
          coverImage {
            url
          }
        }
      }
    }
  `,
})
