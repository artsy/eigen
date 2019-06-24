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
    const { gravityID, id, internalID, is_followed } = show
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
                  gravityID
                  internalID
                  is_followed
                  id
                }
              }
            }
          `,
          variables: {
            input: {
              partner_show_id: internalID,
              unfollow: is_followed,
            },
          },
          optimisticResponse: {
            followShow: {
              show: {
                internalID,
                is_followed: !is_followed,
                gravityID,
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
      switch (__typename as any) {
        case "ArtworkContextAuction":
          header = "In auction"
          name = context.name
          href = context.href
          meta = context.formattedStartDateTime
          imageUrl = context.cover_image && context.cover_image.url ? context.cover_image.url : ""
          renderContextCard = true
          break
        case "ArtworkContextFair":
          const { fair } = artwork
          header = "In fair"
          name = fair.name
          href = fair.href
          meta = fair.exhibition_period
          imageUrl = fair.image && fair.image.url ? fair.image.url : ""
          renderContextCard = true
          break
        case "ArtworkContextPartnerShow":
          // TODO: Replace with ArtworkContextShow when MPv2 supports it
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
      gravityID
      internalID
      context {
        __typename
        ... on ArtworkContextAuction {
          id
          name
          href
          formattedStartDateTime
          cover_image {
            url
          }
        }
      }
      shows(size: 1) {
        id
        name
        href
        gravityID
        internalID
        exhibition_period
        is_followed
        cover_image {
          url
        }
      }
      fair {
        id
        name
        href
        exhibition_period
        image {
          url
        }
      }
    }
  `,
})
