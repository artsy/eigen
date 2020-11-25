import { ShowItemRow_show } from "__generated__/ShowItemRow_show.graphql"
import { ShowItemRowMutation } from "__generated__/ShowItemRowMutation.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import colors from "lib/data/colors"
import { Pin } from "lib/Icons/Pin"
import { navigate } from "lib/navigation/navigate"
import { exhibitionDates } from "lib/Scenes/Map/exhibitionPeriodParser"
import { hrefForPartialShow } from "lib/utils/router"
import { Schema, Track, track as _track } from "lib/utils/track"
import { debounce } from "lodash"
import { Box, Button, color, Flex, Sans, space, Touchable } from "palette"
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
  isListItem?: boolean
}

interface State {
  isFollowedSaving: boolean
}

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const track: Track<Props, {}> = _track

@track()
export class ShowItemRow extends React.Component<Props, State> {
  state = {
    isFollowedSaving: false,
  }
  handleTap = debounce((_slug: string, _internalID: string) => {
    const href = hrefForPartialShow(this.props.show)
    navigate(href)
  })

  @track((props) => {
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
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          return commitMutation<ShowItemRowMutation>(this.props.relay.environment, {
            onCompleted: () => this.handleShowSuccessfullyUpdated(),
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
                partnerShowID: showID,
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
            updater: (store) => {
              // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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

  renderItemDetails() {
    const { show, shouldHideSaveButton } = this.props
    const mainCoverImageURL = show.cover_image && show.cover_image.url

    const galleryProfileIcon = show.isStubShow && show.partner?.profile?.image?.url

    const imageURL = mainCoverImageURL || galleryProfileIcon
    return (
      <Flex flexDirection="row" alignItems="center">
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
          {!!(show.partner && show.partner.name) && (
            <Sans size="3t" color="black" weight="medium" numberOfLines={1} ml={15}>
              {show.partner.name}
            </Sans>
          )}
          {!!show.name && (
            <Sans size="3t" color={color("black60")} ml={15} numberOfLines={1}>
              {show.name}
            </Sans>
          )}
          {!!(show.exhibition_period && show.status) && (
            <Sans size="3t" color={color("black60")} ml={15}>
              {show.status.includes("closed")
                ? show.status.charAt(0).toUpperCase() + show.status.slice(1)
                : exhibitionDates(
                    show.exhibition_period,
                    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                    show.end_at
                  )}
            </Sans>
          )}
        </Flex>
        {!shouldHideSaveButton && (
          <Button
            variant={show.is_followed ? "secondaryOutline" : "primaryBlack"}
            size="small"
            onPress={() => this.handleSave()}
            loading={this.state.isFollowedSaving}
            longestText="Saved"
          >
            {show.is_followed ? "Saved" : "Save"}
          </Button>
        )}
      </Flex>
    )
  }

  render() {
    const { show, isListItem } = this.props

    return isListItem ? (
      <Touchable
        underlayColor={color("black5")}
        onPress={() => this.handleTap(show.slug, show.internalID)}
        style={{ paddingHorizontal: 20, paddingVertical: 5 }}
      >
        {this.renderItemDetails()}
      </Touchable>
    ) : (
      <TouchableWithoutFeedback onPress={() => this.handleTap(show.slug, show.internalID)}>
        {this.renderItemDetails()}
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
      }
      is_fair_booth: isFairBooth
      end_at: endAt
    }
  `,
})

const DefaultImageContainer = styled(Box)`
  align-items: center;
  background-color: ${colors["gray-regular"]};
  height: ${space(6)};
  width: ${space(6)};
`
