import { OwnerType } from "@artsy/cohesion"
import {
  Flex,
  Screen,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { ActivityItemScreenQuery } from "__generated__/ActivityItemScreenQuery.graphql"
import { AlertNotification } from "app/Scenes/Activity/components/AlertNotification"
import { ArtworkPublishedNotification } from "app/Scenes/Activity/components/ArtworkPublishedNotification"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { FC } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { screen } from "app/utils/track/helpers"
import { ArticleFeaturedArtistNotification } from "app/Scenes/Activity/components/ArticleFeaturedArtistNotification"
import { ViewingRoomPublishedNotification } from "app/Scenes/Activity/components/ViewingRoomPublishedNotification"

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
          return <ArtworkPublishedNotification notification={data.me?.notification} />
        case "ArticleFeaturedArtistNotificationItem":
          return <ArticleFeaturedArtistNotification notification={data.me?.notification} />
        case "ViewingRoomPublishedNotificationItem":
          return <ViewingRoomPublishedNotification notification={data.me?.notification} />
        default:
          // TODO: Add fallback for other notification types
          return (
            <Screen>
              <Screen.Header onBack={goBack} title="Title" />
              <Text>
                The notification screen for the type "{notificationType}" has not been implemented
                yet.
              </Text>
            </Screen>
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
        ...ArtworkPublishedNotification_notification
        ...ArticleFeaturedArtistNotification_notification
        ...ViewingRoomPublishedNotification_notification
      }
    }
  }
`

const Placeholder: React.FC = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      // TODO: Update screen owner type
      info={screen({ context_screen_owner_type: OwnerType.newWorksForYou })}
    >
      <Screen>
        <Screen.Header onBack={goBack} />

        <Screen.Body fullwidth>
          <Skeleton>
            <Flex m={2}>
              <SkeletonText variant="lg-display" mb={2}>
                3 New Works by Jonas Lund
              </SkeletonText>

              <Spacer y={2} />

              <SkeletonText variant="lg-display" mb={2}>
                Description
              </SkeletonText>
            </Flex>

            <SkeletonBox width="100%" height={400} />
          </Skeleton>
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
