import { Box, Button, Flex, Image, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { ShowItemRowMutation } from "__generated__/ShowItemRowMutation.graphql"
import { ShowItemRow_show$data, ShowItemRow_show$key } from "__generated__/ShowItemRow_show.graphql"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { Pin } from "app/Components/Icons/Pin"
import { exhibitionDates } from "app/Scenes/Map/exhibitionPeriodParser"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { hrefForPartialShow } from "app/utils/router"
import { Schema } from "app/utils/track"
import { debounce } from "lodash"
import React, { useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

interface Props {
  show: ShowItemRow_show$key
  onSaveStarted?: () => void
  onSaveEnded?: () => void
  shouldHideSaveButton?: boolean
  isListItem?: boolean
}

export const ShowItemRow: React.FC<Props> = ({
  show: showProp,
  onSaveStarted,
  onSaveEnded,
  shouldHideSaveButton,
  isListItem,
}) => {
  const color = useColor()
  const show = useFragment(showFragment, showProp)
  const [isFollowedSaving, setIsFollowedSaving] = useState(false)
  const { trackEvent } = useTracking()

  const handleTap = debounce((_slug: string, _internalID: string) => {
    const href = hrefForPartialShow(show)
    navigate(href)
  })

  const handleSave = () => {
    const { slug: showSlug, id: nodeID, internalID: showID, is_followed: isShowFollowed } = show

    if (showID && showSlug && nodeID && !isFollowedSaving) {
      trackEvent(tracks.trackSave(show))

      onSaveStarted?.()

      setIsFollowedSaving(true)
      commitMutation<ShowItemRowMutation>(getRelayEnvironment(), {
        onCompleted: () => handleShowSuccessfullyUpdated(),
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
          const show = store?.get(nodeID)
          if (show) {
            show.setValue(!isShowFollowed, "is_followed")
          }
        },
      })
    }
  }

  const handleShowSuccessfullyUpdated = () => {
    onSaveEnded?.()
    setIsFollowedSaving(false)
  }

  const renderItemDetails = () => {
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
                onPress={handleSave}
                loading={isFollowedSaving}
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

  if (isListItem) {
    return (
      <Touchable
        accessibilityRole="button"
        underlayColor={color("mono5")}
        onPress={() => handleTap(show.slug, show.internalID)}
        style={{ paddingHorizontal: 20, paddingVertical: 5 }}
      >
        {renderItemDetails()}
      </Touchable>
    )
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => handleTap(show.slug, show.internalID)}
      accessibilityRole="button"
    >
      {renderItemDetails()}
    </TouchableWithoutFeedback>
  )
}

/// NOTE: To make sure that this is consistent across all places where we
///       show it (e.g. Favs, inside the City Map tray ) - you need to make
///       sure that any data changes are included in GlobalMap's query.
const showFragment = graphql`
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
`

const DefaultImageContainer = styled(Box)`
  align-items: center;
  background-color: ${themeGet("colors.mono10")};
  height: ${themeGet("space.6")};
  width: ${themeGet("space.6")};
`

const tracks = {
  trackSave: (show: ShowItemRow_show$data) => {
    return {
      action_name: show.is_followed ? Schema.ActionNames.UnsaveShow : Schema.ActionNames.SaveShow,
      action_type: Schema.ActionTypes.Success,
      owner_type: Schema.OwnerEntityTypes.Show,
      owner_id: show.internalID,
      owner_slug: show.slug,
    } as any
  },
}
