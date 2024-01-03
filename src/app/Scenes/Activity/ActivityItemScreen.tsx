import { Flex, Screen, Skeleton, SkeletonBox, SkeletonText, Text } from "@artsy/palette-mobile"
import { ActivityItemScreenQuery } from "__generated__/ActivityItemScreenQuery.graphql"
import { AlertNotification } from "app/Scenes/Activity/components/AlertNotification"
import { FollowNotification } from "app/Scenes/Activity/components/FollowNotification"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { FC } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface ActivityItemScreenQueryRendererProps {
  notificationID: string
}

export const ActivityItemScreenQueryRenderer: FC<ActivityItemScreenQueryRendererProps> =
  withSuspense(
    ({ notificationID }) => {
      const data = useLazyLoadQuery<ActivityItemScreenQuery>(ActivityItemQuery, {
        internalID: notificationID,
      })

      // TODO: Implement error handling
      if (!data.me?.notification) {
        return null
      }

      const notificationType = data.me?.notification?.item?.__typename

      switch (notificationType) {
        case "AlertNotificationItem":
          return <AlertNotification notification={data.me?.notification} />
        case "ArtworkPublishedNotificationItem":
          return <FollowNotification notification={data.me?.notification} />
        default:
          // TODO: Add fallback for other notification types
          return (
            <Text>
              The notification screen for the type "{notificationType}" has not been implemented
              yet.
            </Text>
          )
      }
    },
    () => <Placeholder />
  )

const ActivityItemQuery = graphql`
  query ActivityItemScreenQuery($internalID: String!) {
    me {
      notification(id: $internalID) {
        item {
          __typename
        }

        ...AlertNotification_notification
        ...FollowNotification_notification
      }
    }
  }
`

const Placeholder: React.FC = () => {
  return (
    <Screen>
      <Screen.Header onBack={goBack} />

      <Screen.Body fullwidth>
        <Skeleton>
          <Flex m={2}>
            <SkeletonText variant="lg-display" mb={2}>
              Title
            </SkeletonText>

            <SkeletonBox width="100%" height={400} />
          </Flex>
        </Skeleton>
      </Screen.Body>
    </Screen>
  )
}
