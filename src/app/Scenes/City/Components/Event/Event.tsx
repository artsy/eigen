import { Box, Button, Flex, Image, Text, useColor } from "@artsy/palette-mobile"
import { EventMutation } from "__generated__/EventMutation.graphql"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { Show } from "app/utils/cityGuide/types"
import { exhibitionDates } from "app/utils/exhibitionPeriodParser"
import { Schema } from "app/utils/track"
import { useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { graphql, useMutation } from "react-relay"
import { useTracking } from "react-tracking"

const TEXT_CONTAINER_WIDTH = 200

interface Props {
  event: Show
}

export const Event: React.FC<Props> = ({ event }) => {
  const { name, exhibition_period, partner, cover_image, is_followed, end_at } = event
  const partnerName = partner?.name
  const url = cover_image ? cover_image.url : null
  const color = useColor()
  const { trackEvent } = useTracking()
  const [isFollowedSaving, setIsFollowedSaving] = useState(false)
  const [commitFollowShow] = useMutation<EventMutation>(eventMutation)

  const handleTap = () => {
    navigate(`/show/${event.slug}`)
  }

  const handleSaveChange = () => {
    const { slug: showSlug, id: nodeID, internalID: showID, is_followed: isShowFollowed } = event

    if (!showID || !showSlug || !nodeID || isFollowedSaving) {
      return
    }

    setIsFollowedSaving(true)
    trackEvent(tracks.trackSave(event))

    commitFollowShow({
      variables: {
        input: {
          partnerShowID: showID,
          unfollow: isShowFollowed,
        },
      },
      onCompleted: () => {
        setIsFollowedSaving(false)
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

const eventMutation = graphql`
  mutation EventMutation($input: FollowShowInput!) {
    followShow(input: $input) {
      show {
        slug
        internalID
        is_followed: isFollowed
      }
    }
  }
`

const tracks = {
  trackSave: (event: Show) => {
    const { slug, internalID, is_followed } = event
    const actionName = is_followed ? Schema.ActionNames.UnsaveShow : Schema.ActionNames.SaveShow

    return {
      action_name: actionName,
      action_type: Schema.ActionTypes.Success,
      owner_type: Schema.OwnerEntityTypes.Show,
      owner_id: internalID,
      owner_slug: slug,
    }
  },
}
