import { Flex, FollowButton, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { ArticleCard } from "app/Components/ArticleCard"
import { goBack } from "app/system/navigation/navigate"
import { ScrollView } from "react-native"
import { useFragment, graphql } from "react-relay"

interface ArticleFeaturedArtistNotificationProps {
  notification: any
}

export const ArticleFeaturedArtistNotification: React.FC<
  ArticleFeaturedArtistNotificationProps
> = ({ notification }) => {
  const notificationData = useFragment(ArticleFeaturedArtistNotificationFragment, notification)

  const article = notificationData.item.article

  const artist = false // TODO: get featured artist data

  return (
    <Screen>
      <Screen.Header onBack={goBack} title="Editorial" />
      <ScrollView>
        <Flex mx={2} mt={2} mb={4}>
          <Text variant="lg-display">An artist you follow is featured</Text>

          <Spacer y={2} />

          {!!artist && (
            <>
              <Text variant="sm">Some Artist</Text>

              <Spacer y={2} />

              <FollowButton
                haptic
                isFollowed={false}
                onPress={() => {
                  //TODO: handleFollowArtist
                }}
                mb={2}
              />

              <Spacer y={2} />
            </>
          )}

          <ArticleCard article={article} isFluid />
        </Flex>
      </ScrollView>
    </Screen>
  )
}

export const ArticleFeaturedArtistNotificationFragment = graphql`
  fragment ArticleFeaturedArtistNotification_notification on Notification {
    artworksConnection(first: 10) {
      ...NotificationArtworkList_artworksConnection
      totalCount
    }
    headline

    item {
      ... on ArticleFeaturedArtistNotificationItem {
        article {
          internalID
          slug
          href
          publishedAt
          thumbnailImage {
            url(version: "large")
          }
          thumbnailTitle
          vertical
          byline
        }
      }
    }
  }
`
