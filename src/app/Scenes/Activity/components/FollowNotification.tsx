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
import { FollowNotificationFollowArtistMutation } from "__generated__/FollowNotificationFollowArtistMutation.graphql"
import { FollowNotification_notification$key } from "__generated__/FollowNotification_notification.graphql"
import { NotificationArtworkList } from "app/Scenes/Activity/components/NotificationArtworkList"
import { goBack, navigate } from "app/system/navigation/navigate"
import { pluralize } from "app/utils/pluralize"
import { FC } from "react"
import { ScrollView } from "react-native"
import { useFragment, graphql, useMutation } from "react-relay"

interface FollowNotificationProps {
  notification: FollowNotification_notification$key
}

export const FollowNotification: FC<FollowNotificationProps> = ({ notification }) => {
  const [followOrUnfollowArtist] =
    useMutation<FollowNotificationFollowArtistMutation>(FollowArtistMutation)

  const notificationData = useFragment(followNotificationFragment, notification)

  const { artworksConnection, item, targetHref } = notificationData

  const artist = item?.artists?.[0]

  // TODO: Consider moving the title to Metaphysics
  const title = `${notificationData.artworksConnection?.totalCount} New ${pluralize(
    "Work",
    artworksConnection?.totalCount || 0
  )} by ${artist?.name}`

  const handleFollowArtist = () => {
    if (!artist) {
      return
    }

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

    navigate(targetHref)
  }

  if (!artist) {
    // TODO: Handle error
    return <Text>Artist not found!</Text>
  }

  return (
    <Screen>
      <Screen.Header onBack={goBack} title="Follows" />

      <ScrollView>
        <Flex mx={2} mt={2} mb={4}>
          <Text variant="lg-display" mb={2}>
            {title}
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

export const followNotificationFragment = graphql`
  fragment FollowNotification_notification on Notification {
    artworksConnection(first: 10) {
      ...NotificationArtworkList_artworksConnection
      totalCount
    }
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
    targetHref
  }
`

const FollowArtistMutation = graphql`
  mutation FollowNotificationFollowArtistMutation($input: FollowArtistInput!) {
    followArtist(input: $input) {
      artist {
        id
        isFollowed
      }
    }
  }
`
