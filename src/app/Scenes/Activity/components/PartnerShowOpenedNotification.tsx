import { Flex, FollowButton, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { PartnerShowOpenedNotification_notification$key } from "__generated__/PartnerShowOpenedNotification_notification.graphql"
import { ShowItem } from "app/Components/ShowItem"
import { ActivityErrorScreen } from "app/Scenes/Activity/components/ActivityErrorScreen"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { FC } from "react"
import { ScrollView } from "react-native"
import { useFragment, graphql } from "react-relay"

interface PartnerShowOpenedNotificationProps {
  notification: PartnerShowOpenedNotification_notification$key
}

export const PartnerShowOpenedNotification: FC<PartnerShowOpenedNotificationProps> = ({
  notification,
}) => {
  const notificationData = useFragment(PartnerShowOpenedNotificationFragment, notification)

  const { headline, item } = notificationData

  const shows = extractNodes(item?.showsConnection)
  const show = shows[0]

  const { followProfile, isInFlight } = useFollowProfile({
    id: item?.partner?.profile?.id ?? "",
    internalID: item?.partner?.profile?.internalID ?? "",
    isFollowd: item?.partner?.profile?.isFollowed ?? false,
  })

  const partner = item?.partner
  const profile = partner?.profile

  if (!partner || !show) {
    return <ActivityErrorScreen headerTitle="Shows" />
  }

  return (
    <Screen>
      <Screen.Header onBack={goBack} title="Shows" />
      <ScrollView>
        <Flex mx={2} mt={2} mb={4}>
          <Text variant="lg-display">{headline}</Text>

          <Spacer y={1} />

          <FollowButton
            haptic
            isFollowed={!!profile?.isFollowed}
            onPress={followProfile}
            disabled={isInFlight}
            mr={1}
          />

          <Spacer y={4} />

          <Flex flexDirection="column" alignItems="center">
            {shows.map((show) => (
              <ShowItem show={show} key={show.internalID} />
            ))}
          </Flex>
        </Flex>
      </ScrollView>
    </Screen>
  )
}

export const PartnerShowOpenedNotificationFragment = graphql`
  fragment PartnerShowOpenedNotification_notification on Notification {
    headline
    item {
      ... on ShowOpenedNotificationItem {
        partner {
          href
          name
          profile {
            id
            internalID
            isFollowed
            image {
              url(version: "wide")
            }
          }
        }
        showsConnection {
          edges {
            node {
              ...ShowItem_show
              internalID
            }
          }
        }
      }
    }
    notificationType
    publishedAt(format: "RELATIVE")
  }
`
