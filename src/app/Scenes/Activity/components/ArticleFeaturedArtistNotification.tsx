import { Flex, FollowButton, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { ArticleCard_article$data } from "__generated__/ArticleCard_article.graphql"
import { ArticleFeaturedArtistNotificationFollowArtistMutation } from "__generated__/ArticleFeaturedArtistNotificationFollowArtistMutation.graphql"
import { ArticleFeaturedArtistNotification_notification$key } from "__generated__/ArticleFeaturedArtistNotification_notification.graphql"
import { ArticleCard } from "app/Components/ArticleCard"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ScrollView, TouchableOpacity } from "react-native"
import { useFragment, graphql, useMutation } from "react-relay"

interface ArticleFeaturedArtistNotificationProps {
  notification: ArticleFeaturedArtistNotification_notification$key
}

export const ArticleFeaturedArtistNotification: React.FC<
  ArticleFeaturedArtistNotificationProps
> = ({ notification }) => {
  const notificationData = useFragment(ArticleFeaturedArtistNotificationFragment, notification)
  const [followOrUnfollowArtist] =
    useMutation<ArticleFeaturedArtistNotificationFollowArtistMutation>(FollowArtistMutation)

  const { item } = notificationData

  const article = item?.article
  const artists = extractNodes(item?.artistsConnection)

  if (!article || !artists || !artists.length) {
    return (
      <Text variant="lg" m={4}>
        Sorry, something went wrong.
      </Text>
    )
  }

  const handleFollowArtist = () => {
    if (!artists.length) {
      return
    }

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
          <Text variant="lg-display">An artist you follow is featured</Text>

          {!!artists && (
            <>
              <Flex flexDirection="row">
                {artists.map((artist, i: number) => {
                  console.warn(artist)
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (artist.href) {
                          navigate(artist.href)
                        }
                      }}
                      key={artist.internalID}
                    >
                      <Text variant="xs" my={0.5}>
                        {artist.name}
                        {i < artists.length - 1 && ", "}
                      </Text>
                    </TouchableOpacity>
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
        </Flex>
      </ScrollView>
    </Screen>
  )
}

export const ArticleFeaturedArtistNotificationFragment = graphql`
  fragment ArticleFeaturedArtistNotification_notification on Notification {
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
