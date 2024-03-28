import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { ActivityItemScreenQuery } from "__generated__/ActivityItemScreenQuery.graphql"
import { AlertNotification } from "app/Scenes/Activity/components/AlertNotification"
import { ArtworkPublishedNotification } from "app/Scenes/Activity/components/ArtworkPublishedNotification"
import { goBack, navigate } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { FC, useEffect } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { screen } from "app/utils/track/helpers"
import { ArticleFeaturedArtistNotification } from "app/Scenes/Activity/components/ArticleFeaturedArtistNotification"
import { ViewingRoomPublishedNotification } from "app/Scenes/Activity/components/ViewingRoomPublishedNotification"
import { PartnerOfferCreatedNotification } from "app/Scenes/Activity/components/PartnerOfferCreatedNotification"
import { ActivityErrorScreen } from "app/Scenes/Activity/components/ActivityErrorScreen"

export const SUPPORTED_NOTIFICATION_TYPES = [
  "ARTWORK_ALERT",
  "ARTWORK_PUBLISHED",
  "ARTICLE_FEATURED_ARTIST",
  "PARTNER_OFFER_CREATED",
  "VIEWING_ROOM_PUBLISHED",
]

interface ActivityItemScreenQueryRendererProps {
  notificationID: string
}

export const ActivityItemScreenQueryRenderer: FC<ActivityItemScreenQueryRendererProps> =
  withSuspense(
    ({ notificationID }) => {
      const data = useLazyLoadQuery<ActivityItemScreenQuery>(ActivityItemQuery, {
        internalID: notificationID,
      })

      const notification = data.me?.notification

      if (!notification) {
        return <ActivityErrorScreen headerTitle="Activity" />
      }

      const notificationType = notification?.item?.__typename

      // Redirect user to the notifications targetHref if the notification type is not supported
      useEffect(() => {
        if (!SUPPORTED_NOTIFICATION_TYPES.includes(notification?.notificationType as string)) {
          navigate(notification?.targetHref as string)
        }
      }, [notification])

      switch (notificationType) {
        case "AlertNotificationItem":
          return <AlertNotification notification={notification} />
        case "ArtworkPublishedNotificationItem":
          return <ArtworkPublishedNotification notification={notification} />
        case "ArticleFeaturedArtistNotificationItem":
          return <ArticleFeaturedArtistNotification notification={notification} />
        case "ViewingRoomPublishedNotificationItem":
          return <ViewingRoomPublishedNotification notification={notification} />
        case "PartnerOfferCreatedNotificationItem":
          return <PartnerOfferCreatedNotification notification={data.me.notification} />
        default:
          return null
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
        notificationType
        targetHref

        ...AlertNotification_notification
        ...ArtworkPublishedNotification_notification
        ...ArticleFeaturedArtistNotification_notification
        ...ViewingRoomPublishedNotification_notification
        ...PartnerOfferCreatedNotification_notification
        ...PartnerShowOpenedNotification_notification
      }
    }
  }
`

const Placeholder: React.FC = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.activity })}
    >
      <Screen>
        <Screen.Header onBack={goBack} />

        <Screen.Body fullwidth>
          <Skeleton>
            <Flex m={2}>
              <SkeletonText variant="lg-display" mb={2}>
                3 New Works by Jonas Lund
              </SkeletonText>

              <Spacer y={1} />
              <Spacer y={0.5} />

              <SkeletonText variant="lg-display" mb={1}>
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
