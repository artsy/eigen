import { Box, Button, Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { ShowItemRowMutation } from "__generated__/ShowItemRowMutation.graphql"
import { ShowItemRow_show$data } from "__generated__/ShowItemRow_show.graphql"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { Pin } from "app/Components/Icons/Pin"
import { exhibitionDates } from "app/Scenes/Map/exhibitionPeriodParser"
import { navigate } from "app/system/navigation/navigate"
import { hrefForPartialShow } from "app/utils/router"
import { track as _track, Schema, Track } from "app/utils/track"
import { debounce } from "lodash"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"

interface Props {
  show: ShowItemRow_show$data
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
          return commitMutation<ShowItemRowMutation>(this.props.relay?.environment!, {
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
              store!.get(nodeID)!.setValue(!isShowFollowed, "is_followed")
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
      <ThemeAwareClassTheme>
        {({ color }) => (
          <Flex flexDirection="row" alignItems="center">
            {!imageURL ? (
              <DefaultImageContainer p="15px">
                <Pin color={color("mono0")} pinHeight={30} pinWidth={30} />
              </DefaultImageContainer>
            ) : (
              <DefaultImageContainer>
                <Image width={62} height={62} src={imageURL} />
              </DefaultImageContainer>
            )}
            <Flex flexDirection="column" flexGrow={1} width={165} mr={1}>
              {!!(show.partner && show.partner.name) && (
                <Text
                  variant="sm"
                  lineHeight="20px"
                  color="mono100"
                  weight="medium"
                  numberOfLines={1}
                  ml="15px"
                >
                  {show.partner.name}
                </Text>
              )}
              {!!show.name && (
                <Text
                  variant="sm"
                  lineHeight="20px"
                  color={color("mono60")}
                  ml="15px"
                  numberOfLines={1}
                >
                  {show.name}
                </Text>
              )}
              {!!(show.exhibition_period && show.status) && (
                <Text
                  variant="sm"
                  lineHeight="20px"
                  color={color("mono60")}
                  ml="15px"
                  numberOfLines={1}
                >
                  {show.status.includes("closed")
                    ? show.status.charAt(0).toUpperCase() + show.status.slice(1)
                    : exhibitionDates(show.exhibition_period, show.end_at!)}
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
      </ThemeAwareClassTheme>
    )
  }

  render() {
    const { show, isListItem } = this.props

    return isListItem ? (
      <ThemeAwareClassTheme>
        {({ color }) => (
          <Touchable
            underlayColor={color("mono5")}
            onPress={() => this.handleTap(show.slug, show.internalID)}
            style={{ paddingHorizontal: 20, paddingVertical: 5 }}
          >
            {this.renderItemDetails()}
          </Touchable>
        )}
      </ThemeAwareClassTheme>
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
  background-color: ${themeGet("colors.mono10")};
  height: ${themeGet("space.6")};
  width: ${themeGet("space.6")};
`
