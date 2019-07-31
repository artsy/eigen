import { Box, Button, color, Flex, Sans, Serif, space } from "@artsy/palette"
import { ShowItemRow_show } from "__generated__/ShowItemRow_show.graphql"
import { ShowItemRowMutation } from "__generated__/ShowItemRowMutation.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import colors from "lib/data/colors"
import { Pin } from "lib/Icons/Pin"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { ExhibitionDates } from "lib/Scenes/Map/exhibitionPeriodParser"
import { hrefForPartialShow } from "lib/utils/router"
import { Schema, Track, track as _track } from "lib/utils/track"
import { get } from "lodash"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"

interface Props {
  show: ShowItemRow_show
  relay?: RelayProp
  onSaveStarted?: () => void
  onSaveEnded?: () => void
  shouldHideSaveButton?: boolean
}

interface State {
  isFollowedSaving: boolean
}

const track: Track<Props, {}> = _track

@track()
export class ShowItemRow extends React.Component<Props, State> {
  state = {
    isFollowedSaving: false,
  }
  isTapped: boolean

  handleTap(_slug, _internalID) {
    this.isTapped = true
    const href = hrefForPartialShow(this.props.show)
    SwitchBoard.presentNavigationViewController(this, href)
    setTimeout(() => {
      this.isTapped = false
    }, 300)
  }

  @track(props => {
    const {
      show: { slug, internalID, is_followed },
    } = props
    return {
      action_name: is_followed ? Schema.ActionNames.UnsaveShow : Schema.ActionNames.SaveShow,
      action_type: Schema.ActionTypes.Success,
      owner_type: Schema.OwnerEntityTypes.Show,
      owner_id: internalID,
      owner_slug: slug,
    } as any
  })
  handleSave() {
    const {
      show: { slug: showSlug, id: nodeID, internalID: showID, is_followed: isShowFollowed },
    } = this.props

    if (showID && showSlug && nodeID && !this.state.isFollowedSaving) {
      if (this.props.onSaveStarted) {
        this.props.onSaveStarted()
      }

      this.setState(
        {
          isFollowedSaving: true,
        },
        () => {
          return commitMutation<ShowItemRowMutation>(this.props.relay.environment, {
            onCompleted: () => this.handleShowSuccessfullyUpdated(),
            // TODO: Inputs to the mutation might have changed case of the keys!
            mutation: graphql`
              mutation ShowItemRowMutation($input: FollowShowInput!) {
                followShow(input: $input) {
                  show {
                    slug
                    internalID
                    is_followed: isFollowed
                  }
                }
              }
            `,
            variables: {
              input: {
                partner_show_id: showID,
                unfollow: isShowFollowed,
              },
            },
            optimisticResponse: {
              followShow: {
                show: {
                  slug: showSlug,
                  internalID: showID,
                  is_followed: !isShowFollowed,
                },
              },
            },
            updater: store => {
              store.get(nodeID).setValue(!isShowFollowed, "is_followed")
            },
          })
        }
      )
    }
  }

  handleShowSuccessfullyUpdated() {
    if (this.props.onSaveEnded) {
      this.props.onSaveEnded()
    }

    this.setState({
      isFollowedSaving: false,
    })
  }

  render() {
    const { show, shouldHideSaveButton } = this.props
    const mainCoverImageURL = show.cover_image && show.cover_image.url
    const galleryProfileIcon = show.isStubShow && get(show, "partner.profile.image.url")

    const imageURL = mainCoverImageURL || galleryProfileIcon

    return (
      <TouchableWithoutFeedback onPress={() => (!this.isTapped ? this.handleTap(show.slug, show.internalID) : null)}>
        <Flex flexDirection="row">
          {!imageURL ? (
            <DefaultImageContainer p={15}>
              <Pin color={color("white100")} pinHeight={30} pinWidth={30} />
            </DefaultImageContainer>
          ) : (
            <DefaultImageContainer>
              <OpaqueImageView width={58} height={58} imageURL={imageURL} />
            </DefaultImageContainer>
          )}
          <Flex flexDirection="column" flexGrow={1} width={165} mr={10}>
            {show.partner &&
              show.partner.name && (
                <Sans size="3t" color="black" weight="medium" numberOfLines={1} ml={15}>
                  {show.partner.name}
                </Sans>
              )}
            {show.name && (
              <TightendSerif size="3t" color={color("black60")} ml={15} numberOfLines={1}>
                {show.name}
              </TightendSerif>
            )}
            {show.exhibition_period &&
              show.status && (
                <Sans size="3t" color={color("black60")} ml={15}>
                  {show.status.includes("closed")
                    ? show.status.charAt(0).toUpperCase() + show.status.slice(1)
                    : ExhibitionDates(show.exhibition_period, show.end_at)}
                </Sans>
              )}
          </Flex>
          {!shouldHideSaveButton && (
            <Button variant="noOutline" onPress={() => this.handleSave()} loading={this.state.isFollowedSaving}>
              {show.is_followed ? "Saved" : "Save"}
            </Button>
          )}
        </Flex>
      </TouchableWithoutFeedback>
    )
  }
}

/// NOTE: To make sure that this is consistent across all places where we
///       show it (e.g. Favs, inside the City Map tray ) - you need to make
///       sure that any data changes are included in GlobalMap's query.
export const ShowItemRowContainer = createFragmentContainer(ShowItemRow, {
  show: graphql`
    fragment ShowItemRow_show on Show {
      id
      slug
      internalID
      is_followed: isFollowed
      name
      isStubShow
      partner {
        ... on Partner {
          name
          profile {
            image {
              url(version: "square")
            }
          }
        }
      }
      href
      exhibition_period: exhibitionPeriod
      status
      cover_image: coverImage {
        url
        aspect_ratio: aspectRatio
      }
      is_fair_booth: isFairBooth
      start_at: startAt
      end_at: endAt
    }
  `,
})

const TightendSerif = styled(Serif)`
  top: 3;
`

const DefaultImageContainer = styled(Box)`
  align-items: center;
  background-color: ${colors["gray-regular"]};
  height: ${space(6)};
  width: ${space(6)};
`
