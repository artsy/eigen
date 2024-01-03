import {
  Box,
  Flex,
  Join,
  Screen,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { ActivityItemScreenQuery } from "__generated__/ActivityItemScreenQuery.graphql"
import { AlertNotification } from "app/Scenes/Activity/components/AlertNotification"
import { FollowNotification } from "app/Scenes/Activity/components/FollowNotification"
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
      <Skeleton>
        <Flex m={2}>
          <SkeletonText variant="lg-display" mb={2}>
            Title
          </SkeletonText>

          <SkeletonBox width="100%" height={400} />
        </Flex>
      </Skeleton>
    </Screen>
  )
}
