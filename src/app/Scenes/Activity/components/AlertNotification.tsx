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
import { ActivityErrorScreen } from "app/Scenes/Activity/components/ActivityErrorScreen"
import { NotificationArtworkList } from "app/Scenes/Activity/components/NotificationArtworkList"
import { goBack, navigate } from "app/system/navigation/navigate"
import { FC } from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { useFragment, graphql } from "react-relay"

interface AlertNotificationProps {
  notification: AlertNotification_notification$key
}

export const AlertNotification: FC<AlertNotificationProps> = ({ notification }) => {
  const notificationData = useFragment(alertNotificationFragment, notification)

  const { artworksConnection, headline, item } = notificationData

  const alert = item?.alert
  const artist = item?.alert?.artists?.[0]

  if (!alert || !artist) {
    return <ActivityErrorScreen headerTitle="Alerts" />
  }

  const handleEditAlertPress = () => {
    // TODO: Add tracking

    navigate(`/settings/alerts/${alert.internalID}/edit`)
  }

  const handleViewAllWorksPress = () => {
    // TODO: Add tracking

    navigate(`/artist/${artist?.slug}/works-for-sale`)
  }

  return (
    <Screen>
      <Screen.Header
        onBack={goBack}
        title="Alerts"
        rightElements={
          <TouchableOpacity onPress={handleEditAlertPress} testID="edit-alert-header-link">
            <Flex width={100} height="100%" justifyContent="center">
              <Text textAlign="right" variant="xs">
                Edit
              </Text>
            </Flex>
          </TouchableOpacity>
        }
      />

      <ScrollView>
        <Flex mx={2} mt={2}>
          <Text variant="lg-display">{headline}</Text>

          <Spacer y={2} />

          <Flex flexDirection="row" flexWrap="wrap">
            {alert.labels.map((label) => (
              <Pill
                testID="alert-label-pill"
                variant="filter"
                mr={1}
                mb={1}
                key={`filter-label-${label?.displayValue}`}
                disabled
                borderColor="black30"
              >
                {label?.displayValue}
              </Pill>
            ))}
          </Flex>
        </Flex>

        <Spacer y={0.5} />

        <NotificationArtworkList artworksConnection={artworksConnection} />

        <Flex mx={2} mt={1} mb={2}>
          <Button
            block
            variant="outline"
            onPress={handleEditAlertPress}
            testID="edit-alert-CTA"
            mb={1}
          >
            Edit Alert
          </Button>

          <Spacer y={2} />

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
    headline
    item {
      ... on AlertNotificationItem {
        alert {
          internalID
          artists {
            name
            slug
          }
          labels {
            displayValue
          }
        }
      }
    }
  }
`
