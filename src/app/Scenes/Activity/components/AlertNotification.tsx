import {
  Button,
  Flex,
  Text,
  Screen,
  Spacer,
  ArrowRightIcon,
  Touchable,
  Pill,
} from "@artsy/palette-mobile"
import { AlertNotification_notification$key } from "__generated__/AlertNotification_notification.graphql"
import { NotificationArtworkList } from "app/Scenes/Activity/components/NotificationArtworkList"
import { getNotificationtitle } from "app/Scenes/Activity/utils/getNotificationTitle"
import { goBack, navigate } from "app/system/navigation/navigate"
import { FC } from "react"
import { ScrollView } from "react-native"
import { useFragment, graphql } from "react-relay"

interface AlertNotificationProps {
  notification: AlertNotification_notification$key
}

export const AlertNotification: FC<AlertNotificationProps> = ({ notification }) => {
  const notificationData = useFragment(alertNotificationFragment, notification)

  const { artworksConnection, item, targetHref } = notificationData

  const alert = item?.alert
  const artist = item?.alert?.artists?.[0]

  // TODO: Better error handling
  if (!alert) {
    return <Text>Alert not found!</Text>
  }

  if (!artist) {
    return <Text>Artist not found!</Text>
  }

  // TODO: Consider moving the title to Metaphysics
  const title = getNotificationtitle(artworksConnection?.totalCount || 0, artist?.name)

  const handleEditAlertPress = () => {
    // TODO: Add tracking

    navigate(`/settings/alerts/${alert.internalID}/edit`)
  }

  const handleViewAllWorksPress = () => {
    // TODO: Add tracking

    navigate(targetHref)
  }

  return (
    <Screen>
      <Screen.Header onBack={goBack} title="Alerts" />

      <ScrollView>
        <Flex mx={2} mt={2} mb={4}>
          <Text variant="lg-display" mb={2}>
            {title}
          </Text>

          <Spacer y={2} />

          {alert.labels.map((label) => (
            <Pill testID="alert-label-pill" m={0.5} key={`filter-label-${label?.displayValue}`}>
              {label?.displayValue}
            </Pill>
          ))}
        </Flex>

        <NotificationArtworkList artworksConnection={artworksConnection} />

        <Spacer y={4} />

        <Flex mx={2} mt={1} mb={2}>
          <Button block variant="outline" onPress={handleEditAlertPress}>
            Edit Alert
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

export const alertNotificationFragment = graphql`
  fragment AlertNotification_notification on Notification {
    artworksConnection(first: 10) {
      ...NotificationArtworkList_artworksConnection
      totalCount
    }

    item {
      ... on AlertNotificationItem {
        alert {
          internalID
          artists {
            name
          }
          labels {
            displayValue
          }
        }
      }
    }
    targetHref
  }
`
