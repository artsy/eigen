import { ChevronRightIcon } from "@artsy/icons/native"
import { Button, DEFAULT_HIT_SLOP, Flex, Pill, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { AlertNotification_notification$key } from "__generated__/AlertNotification_notification.graphql"
import { ActivityErrorScreen } from "app/Scenes/Activity/components/ActivityErrorScreen"
import { NotificationArtworkList } from "app/Scenes/Activity/components/NotificationArtworkList"
import { RouterLink } from "app/system/navigation/RouterLink"
import { goBack } from "app/system/navigation/navigate"
import { FC } from "react"
import { ScrollView } from "react-native"
import { graphql, useFragment } from "react-relay"

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

  const editAlertHref = `/favorites/alerts/${alert.internalID}/edit`

  return (
    <Screen>
      <Screen.Header
        onBack={goBack}
        title="Alerts"
        rightElements={
          <RouterLink to={editAlertHref} testID="edit-alert-header-link" hitSlop={DEFAULT_HIT_SLOP}>
            <Text textAlign="right" variant="xs">
              Edit
            </Text>
          </RouterLink>
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
                borderColor="mono30"
              >
                {label?.displayValue}
              </Pill>
            ))}
          </Flex>
        </Flex>

        <Spacer y={0.5} />

        <NotificationArtworkList artworksConnection={artworksConnection} />

        <Spacer y={2} />

        <Flex mx={2} mb={1}>
          <RouterLink hasChildTouchable to={editAlertHref}>
            <Button block variant="outline" testID="edit-alert-CTA">
              Edit Alert
            </Button>
          </RouterLink>

          <Spacer y={2} />

          <RouterLink to={`/artist/${artist?.slug}/works-for-sale`}>
            <Flex flexDirection="row">
              <Text fontWeight="bold">View all works by {artist.name}</Text>
              <Flex alignSelf="center">
                <ChevronRightIcon fill="mono30" ml={0.5} pl={0.3} />
              </Flex>
            </Flex>
          </RouterLink>
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
