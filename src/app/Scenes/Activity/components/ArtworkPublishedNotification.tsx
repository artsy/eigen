import {
  Button,
  Flex,
  Text,
  Screen,
  FollowButton,
  Spacer,
  ArrowRightIcon,
  Touchable,
} from "@artsy/palette-mobile"
import { ArtworkPublishedNotificationFollowArtistMutation } from "__generated__/ArtworkPublishedNotificationFollowArtistMutation.graphql"
import { ArtworkPublishedNotification_notification$key } from "__generated__/ArtworkPublishedNotification_notification.graphql"
import { ActivityErrorScreen } from "app/Scenes/Activity/components/ActivityErrorScreen"
import { NotificationArtworkList } from "app/Scenes/Activity/components/NotificationArtworkList"
import { goBack, navigate } from "app/system/navigation/navigate"
import { FC } from "react"
import { ScrollView } from "react-native"
import { useFragment, graphql, useMutation } from "react-relay"

interface ArtworkPublishedNotificationProps {
  notification: ArtworkPublishedNotification_notification$key
}

export const ArtworkPublishedNotification: FC<ArtworkPublishedNotificationProps> = ({
  notification,
}) => {
  const [followOrUnfollowArtist] =
    useMutation<ArtworkPublishedNotificationFollowArtistMutation>(FollowArtistMutation)

  const notificationData = useFragment(ArtworkPublishedNotificationFragment, notification)

  const { artworksConnection, headline, item } = notificationData

  const artist = item?.artists?.[0]

  if (!artist || !artworksConnection) {
    return <ActivityErrorScreen headerTitle="Follows" />
  }

  const handleFollowArtist = () => {
    followOrUnfollowArtist({
      variables: {
        input: { artistID: artist?.slug, unfollow: artist?.isFollowed },
      },
      optimisticResponse: {
        followArtist: {
          artist: {
            id: artist?.id,
            isFollowed: !artist?.isFollowed,
          },
        },
      },
    })
  }

  const handleEditFollowsPress = () => {
    // TODO: Add tracking

    navigate("/favorites")
  }

  const handleViewAllWorksPress = () => {
    // TODO: Add tracking

    navigate(`/artist/${artist?.slug}/works-for-sale`)
  }

  if (!artist) {
    return (
      <Text variant="lg" m={4}>
        Sorry, something went wrong.
      </Text>
    )
  }

  return (
    <Screen>
      <Screen.Header onBack={goBack} title="Follows" />

      <ScrollView>
        <Flex mx={2} mt={2} mb={4}>
          <Text variant="lg-display" mb={2}>
            {headline}
          </Text>

          <Spacer y={2} />

          <FollowButton haptic isFollowed={!!artist.isFollowed} onPress={handleFollowArtist} />
        </Flex>

        <NotificationArtworkList artworksConnection={artworksConnection} />

        <Spacer y={4} />

        <Flex mx={2} mt={1} mb={2}>
          <Button block variant="outline" onPress={handleEditFollowsPress}>
            Edit Follows
          </Button>

          <Spacer y={4} />

          <Touchable onPress={handleViewAllWorksPress}>
            <Flex flexDirection="row">
              <Text fontWeight="bold">View all works by {artist.name}</Text>
              <Flex alignSelf="center">
                <ArrowRightIcon fill="black30" ml={0.5} pl={0.3} />
              </Flex>
            </Flex>
          </Touchable>
        </Flex>

        <Spacer y={4} />
      </ScrollView>
    </Screen>
  )
}

export const ArtworkPublishedNotificationFragment = graphql`
  fragment ArtworkPublishedNotification_notification on Notification {
    artworksConnection(first: 10) {
      ...NotificationArtworkList_artworksConnection
      totalCount
    }
    headline
    item {
      ... on ArtworkPublishedNotificationItem {
        artists {
          id
          isFollowed
          name
          slug
        }
      }
    }
  }
`

const FollowArtistMutation = graphql`
  mutation ArtworkPublishedNotificationFollowArtistMutation($input: FollowArtistInput!) {
    followArtist(input: $input) {
      artist {
        id
        isFollowed
      }
    }
  }
`
