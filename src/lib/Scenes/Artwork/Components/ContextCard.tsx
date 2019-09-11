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
    const { slug, id, internalID, is_followed } = show
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
                  is_followed: isFollowed
                  id
                }
              }
            }
          `,
          variables: {
            input: {
              partnerShowID: internalID,
              unfollow: is_followed,
            },
          },
          optimisticResponse: {
            followShow: {
              show: {
                internalID,
                is_followed: !is_followed,
                slug,
                id,
              },
            },
          },
          updater: store => {
            store.get(id).setValue(!is_followed, "is_followed")
          },
        })
      }
    )
  }

  @track((_props, _state, args) => {
    const show = args[0]
    return {
      action_name: show.is_followed ? Schema.ActionNames.UnsaveShow : Schema.ActionNames.SaveShow,
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
    const { is_followed } = show
    const { isSaving } = this.state

    return (
      <Button
        variant={is_followed ? "secondaryOutline" : "primaryBlack"}
        onPress={() => this.handleFollowShow(show)}
        size="small"
        longestText="Following"
        loading={isSaving}
      >
        {is_followed ? "Following" : "Follow"}
      </Button>
    )
  }

  render() {
    let name = ""
    let href = ""
    let meta = null
    let header = ""
    let imageUrl = ""
    let followButton = null
    let renderContextCard = false

    const { artwork } = this.props
    const { context } = artwork
    if (context) {
      const { __typename } = context

      console.log("context", context)

      switch (__typename as any) {
        case "Sale":
          header = context.isAuction ? "In auction" : "In sale"
          name = context.name
          href = context.href
          meta = context.isLiveOpen ? "In progress" : context.formattedStartDateTime
          imageUrl = context.cover_image && context.cover_image.url ? context.cover_image.url : ""
          renderContextCard = true
          break
        case "Fair":
          header = "In fair"
          name = context.name
          href = context.href
          meta = context.exhibition_period
          imageUrl = context.image && context.image.url ? context.image.url : ""
          renderContextCard = true
          break
        case "Show":
          const { shows } = artwork
          const show = shows[0]
          header = "In show"
          name = show.name
          href = show.href
          meta = show.exhibition_period
          imageUrl = show.cover_image && show.cover_image.url ? show.cover_image.url : ""
          followButton = this.followButton(show)
          renderContextCard = true
          break
      }
    }

    return (
      <>
        {renderContextCard && (
          <Box mb={2}>
            <Sans size="3t" weight="medium" color="black100">
              {header}
            </Sans>
          </Box>
        )}
        {renderContextCard && (
          <Flex>
            <TouchableWithoutFeedback onPress={() => this.handleTap(this, href)}>
              <EntityHeader
                name={name}
                href={href}
                meta={meta}
                imageUrl={imageUrl}
                initials={null}
                FollowButton={followButton}
              />
            </TouchableWithoutFeedback>
          </Flex>
        )}
      </>
    )
  }
}

export const ContextCardFragmentContainer = createFragmentContainer(ContextCard, {
  artwork: graphql`
    fragment ContextCard_artwork on Artwork {
      id
      slug
      internalID
      context {
        __typename
        ... on Sale {
          id
          name
          isLiveOpen
          href
          formattedStartDateTime
          isAuction
          cover_image: coverImage {
            url
          }
        }
        ... on Fair {
          id
          name
          href
          exhibition_period: exhibitionPeriod
          image {
            url
          }
        }
        ... on Show {
          id
          name
          href
          exhibition_period: exhibitionPeriod
          coverImage {
            url
          }
        }
      }
      shows(size: 1) {
        id
        name
        href
        slug
        internalID
        exhibition_period: exhibitionPeriod
        is_followed: isFollowed
        cover_image: coverImage {
          url
        }
      }
    }
  `,
})
