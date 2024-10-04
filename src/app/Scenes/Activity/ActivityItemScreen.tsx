import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { ActivityItemScreenQuery } from "__generated__/ActivityItemScreenQuery.graphql"
import { AlertNotification } from "app/Scenes/Activity/components/AlertNotification"
import { ArtworkPublishedNotification } from "app/Scenes/Activity/components/ArtworkPublishedNotification"
import { goBack, navigate } from "app/system/navigation/navigate"
import { strictWithSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { FC, useEffect } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { screen } from "app/utils/track/helpers"
import { ArticleFeaturedArtistNotification } from "app/Scenes/Activity/components/ArticleFeaturedArtistNotification"
import { ViewingRoomPublishedNotification } from "app/Scenes/Activity/components/ViewingRoomPublishedNotification"
import { PartnerOfferCreatedNotification } from "app/Scenes/Activity/components/PartnerOfferCreatedNotification"
import { ActivityErrorScreen } from "app/Scenes/Activity/components/ActivityErrorScreen"
import { PartnerShowOpenedNotification } from "app/Scenes/Activity/components/PartnerShowOpenedNotification"

export const SUPPORTED_NOTIFICATION_TYPES = [
  "ARTWORK_ALERT",
  "ARTWORK_PUBLISHED",
  "ARTICLE_FEATURED_ARTIST",
  "PARTNER_OFFER_CREATED",
  "PARTNER_SHOW_OPENED",
  "VIEWING_ROOM_PUBLISHED",
]

interface ActivityItemScreenQueryRendererProps {
  notificationID: string
}

export const ActivityItemScreenQueryRenderer: FC<ActivityItemScreenQueryRendererProps> =
  strictWithSuspense(
    ({ notificationID }) => {
      const data = useLazyLoadQuery<ActivityItemScreenQuery>(ActivityItemQuery, {
        internalID: notificationID,
      })

      const notification = data.me?.notification

      if (!notification) {
        return <ActivityErrorScreen headerTitle="Activity" />
      }

      // Redirect user to the notifications targetHref if the notification type is not supported
      useEffect(() => {
        if (!SUPPORTED_NOTIFICATION_TYPES.includes(notification?.notificationType as string)) {
          navigate(notification?.targetHref as string)
        }
      }, [notification])

      switch (notification?.notificationType) {
        case "ARTWORK_ALERT":
          return <AlertNotification notification={data.me?.notification} />
        case "ARTWORK_PUBLISHED":
          return <ArtworkPublishedNotification notification={data.me?.notification} />
        case "ARTICLE_FEATURED_ARTIST":
          return <ArticleFeaturedArtistNotification notification={data.me?.notification} />
        case "PARTNER_OFFER_CREATED":
          return <PartnerOfferCreatedNotification notification={data.me?.notification} />
        case "PARTNER_SHOW_OPENED":
          return <PartnerShowOpenedNotification notification={data.me?.notification} />
        case "VIEWING_ROOM_PUBLISHED":
          return <ViewingRoomPublishedNotification notification={data.me?.notification} />
        default:
          return null
      }
    },
    () => <Placeholder />,
    (fallbackProps) => {
      return <ActivityErrorScreen headerTitle="Activity" error={fallbackProps.error} />
    }
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
