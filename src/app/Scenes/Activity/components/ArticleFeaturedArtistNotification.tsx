import { Button, Flex, FollowButton, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { ArticleCard_article$data } from "__generated__/ArticleCard_article.graphql"
import { ArticleFeaturedArtistNotificationFollowArtistMutation } from "__generated__/ArticleFeaturedArtistNotificationFollowArtistMutation.graphql"
import { ArticleFeaturedArtistNotification_notification$key } from "__generated__/ArticleFeaturedArtistNotification_notification.graphql"
import { ArticleCard } from "app/Components/ArticleCard"
import { ActivityErrorScreen } from "app/Scenes/Activity/components/ActivityErrorScreen"
import { RouterLink } from "app/system/navigation/RouterLink"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ScrollView } from "react-native"
import { graphql, useFragment, useMutation } from "react-relay"

interface ArticleFeaturedArtistNotificationProps {
  notification: ArticleFeaturedArtistNotification_notification$key
}

export const ArticleFeaturedArtistNotification: React.FC<
  ArticleFeaturedArtistNotificationProps
> = ({ notification }) => {
  const notificationData = useFragment(ArticleFeaturedArtistNotificationFragment, notification)
  const [followOrUnfollowArtist] =
    useMutation<ArticleFeaturedArtistNotificationFollowArtistMutation>(FollowArtistMutation)

  const { message, item } = notificationData

  const article = item?.article
  const artists = extractNodes(item?.artistsConnection)

  if (!article || !artists) {
    return <ActivityErrorScreen headerTitle="Editorial" />
  }

  const handleFollowArtist = () => {
    followOrUnfollowArtist({
      variables: {
        input: { artistID: artists[0].slug, unfollow: artists[0].isFollowed },
      },
      optimisticResponse: {
        followArtist: {
          artist: {
            id: artists[0].id,
            isFollowed: !artists[0].isFollowed,
          },
        },
      },
    })
  }

  return (
    <Screen>
      <Screen.Header onBack={goBack} title="Editorial" />
      <ScrollView>
        <Flex mx={2} mt={2} mb={4}>
          <Text variant="lg-display">{message}</Text>

          {!!artists && (
            <>
              <Flex flexDirection="row">
                {artists.map((artist, i: number) => {
                  console.warn(artist)
                  return (
                    <RouterLink to={artist.href} key={artist.internalID}>
                      <Text variant="xs" my={0.5}>
                        {artist.name}
                        {i < artists.length - 1 && ", "}
                      </Text>
                    </RouterLink>
                  )
                })}
              </Flex>

              <Spacer y={2} />

              {artists.length === 1 && (
                <>
                  <FollowButton
                    haptic
                    isFollowed={!!artists[0].isFollowed}
                    onPress={handleFollowArtist}
                  />
                  <Spacer y={2} />
                </>
              )}

              <Spacer y={2} />
            </>
          )}

          <ArticleCard article={article as ArticleCard_article$data} isFluid />

          <RouterLink hasChildTouchable to={article.href}>
            <Button mt={2} block accessibilityLabel="Read Article">
              Read Article
            </Button>
          </RouterLink>
        </Flex>
      </ScrollView>
    </Screen>
  )
}

export const ArticleFeaturedArtistNotificationFragment = graphql`
  fragment ArticleFeaturedArtistNotification_notification on Notification {
    message
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
        artistsConnection(first: 10) {
          edges {
            node {
              id
              name
              slug
              internalID
              href
              isFollowed
            }
          }
        }
      }
    }
  }
`

const FollowArtistMutation = graphql`
  mutation ArticleFeaturedArtistNotificationFollowArtistMutation($input: FollowArtistInput!) {
    followArtist(input: $input) {
      artist {
        id
        isFollowed
      }
    }
  }
`
