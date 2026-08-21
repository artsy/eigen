import { Box, Button, Flex, Image, Text, useColor } from "@artsy/palette-mobile"
import { EventMutation } from "__generated__/EventMutation.graphql"
import { exhibitionDates } from "app/utils/exhibitionPeriodParser"
import { Show } from "app/utils/cityGuide/types"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { Schema } from "app/utils/track"
import { useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, graphql } from "react-relay"
import { useTracking } from "react-tracking"

const TEXT_CONTAINER_WIDTH = 200

interface Props {
  event: Show
}

export const Event: React.FC<Props> = ({ event }) => {
  const color = useColor()
  const { trackEvent } = useTracking()
  const [isFollowedSaving, setIsFollowedSaving] = useState(false)

  const { name, exhibition_period, partner, cover_image, is_followed, end_at } = event
  const partnerName = partner?.name
  const url = cover_image ? cover_image.url : null

  const handleSaveChange = () => {
    const { slug: showSlug, id: nodeID, internalID: showID, is_followed: isShowFollowed } = event

    if (!showID || !showSlug || !nodeID || isFollowedSaving) {
      return
    }

    setIsFollowedSaving(true)

    commitMutation<EventMutation>(getRelayEnvironment(), {
      onCompleted: () => {
        setIsFollowedSaving(false)
        trackEvent({
          action_name: isShowFollowed ? Schema.ActionNames.UnsaveShow : Schema.ActionNames.SaveShow,
          action_type: Schema.ActionTypes.Success,
          owner_type: Schema.OwnerEntityTypes.Show,
          owner_id: showID,
          owner_slug: showSlug,
        })
      },
      mutation: graphql`
        mutation EventMutation($input: FollowShowInput!) {
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

  const handleTap = () => {
    navigate(`/show/${event.slug}`)
  }

  return (
    <TouchableWithoutFeedback accessibilityRole="button" onPress={handleTap}>
      <Box mb={2}>
        {!!url && (
          <Box mb={2} justifyContent="center" overflow="hidden">
            <Image src={url} height={145} />
          </Box>
        )}
        <Flex flexDirection="row" flexWrap="nowrap" justifyContent="space-between">
          <Box width={TEXT_CONTAINER_WIDTH} mb={2}>
            <Text variant="sm" weight="medium" numberOfLines={1} ellipsizeMode="tail">
              {partnerName}
            </Text>
            <Text variant="sm" numberOfLines={1} ellipsizeMode="tail">
              {name}
            </Text>
            {!!exhibition_period && !!end_at && (
              <Text variant="xs" color={color("mono60")}>
                {exhibitionDates(exhibition_period, end_at)}
              </Text>
            )}
          </Box>
          <Button
            variant={is_followed ? "outline" : "fillDark"}
            loading={isFollowedSaving}
            onPress={handleSaveChange}
            longestText="Saved"
            size="small"
          >
            {is_followed ? "Saved" : "Save"}
          </Button>
        </Flex>
      </Box>
    </TouchableWithoutFeedback>
  )
}
