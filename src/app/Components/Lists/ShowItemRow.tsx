import { themeGet } from "@styled-system/theme-get"
import { ShowItemRow_show } from "__generated__/ShowItemRow_show.graphql"
import { ShowItemRowMutation } from "__generated__/ShowItemRowMutation.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Pin } from "app/Icons/Pin"
import { navigate } from "app/navigation/navigate"
import { exhibitionDates } from "app/Scenes/Map/exhibitionPeriodParser"
import { hrefForPartialShow } from "app/utils/router"
import { Schema, Track, track as _track } from "app/utils/track"
import { debounce } from "lodash"
import { Box, Button, ClassTheme, Flex, Text, Touchable } from "palette"
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
            // @ts-ignore RELAY 12 MIGRATION
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
      <ClassTheme>
        {({ color }) => (
          <Flex flexDirection="row" alignItems="center">
            {!imageURL ? (
              <DefaultImageContainer p={15}>
                <Pin color={color("white100")} pinHeight={30} pinWidth={30} />
              </DefaultImageContainer>
            ) : (
              <DefaultImageContainer>
                <OpaqueImageView width={62} height={62} imageURL={imageURL} />
              </DefaultImageContainer>
            )}
            <Flex flexDirection="column" flexGrow={1} width={165} mr={10}>
              {!!(show.partner && show.partner.name) && (
                <Text
                  variant="sm"
                  lineHeight="20"
                  color="black"
                  weight="medium"
                  numberOfLines={1}
                  ml={15}
                >
                  {show.partner.name}
                </Text>
              )}
              {!!show.name && (
                <Text
                  variant="sm"
                  lineHeight="20"
                  color={color("black60")}
                  ml={15}
                  numberOfLines={1}
                >
                  {show.name}
                </Text>
              )}
              {!!(show.exhibition_period && show.status) && (
                <Text
                  variant="sm"
                  lineHeight="20"
                  color={color("black60")}
                  ml={15}
                  numberOfLines={1}
                >
                  {show.status.includes("closed")
                    ? show.status.charAt(0).toUpperCase() + show.status.slice(1)
                    : exhibitionDates(
                        show.exhibition_period,
                        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                        show.end_at
                      )}
                </Text>
              )}
            </Flex>
            {!shouldHideSaveButton && (
              <Button
                variant={show.is_followed ? "outline" : "fillDark"}
                size="small"
                onPress={() => this.handleSave()}
                loading={this.state.isFollowedSaving}
                longestText="Saved"
              >
                {show.is_followed ? "Saved" : "Save"}
              </Button>
            )}
          </Flex>
        )}
      </ClassTheme>
    )
  }

  render() {
    const { show, isListItem } = this.props

    return isListItem ? (
      <ClassTheme>
        {({ color }) => (
          <Touchable
            underlayColor={color("black5")}
            onPress={() => this.handleTap(show.slug, show.internalID)}
            style={{ paddingHorizontal: 20, paddingVertical: 5 }}
          >
            {this.renderItemDetails()}
          </Touchable>
        )}
      </ClassTheme>
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
      exhibition_period: exhibitionPeriod(format: SHORT)
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
  background-color: ${themeGet("colors.black10")};
  height: ${themeGet("space.6")}px;
  width: ${themeGet("space.6")}px;
`
