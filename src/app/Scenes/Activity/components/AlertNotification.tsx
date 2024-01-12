import { Flex, Text, Screen, Touchable } from "@artsy/palette-mobile"
import { FlashList } from "@shopify/flash-list"
import { AlertNotification_notification$key } from "__generated__/AlertNotification_notification.graphql"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { NewWorksForYouHeaderComponent } from "app/Scenes/NewWorksForYou/Components/NewWorksForYouHeader"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { extract } from "query-string"
import { FC } from "react"
import Animated from "react-native-reanimated"
import { useFragment, graphql } from "react-relay"
import { space } from "styled-system"

interface AlertNotificationProps {
  notification: AlertNotification_notification$key
}
export const AlertNotification: FC<AlertNotificationProps> = ({ notification }) => {
  const notificationData = useFragment(alertNotificationFragment, notification)
  const { item, message } = notificationData

  if (!item?.alert) {
    return null
  }

  const handleEditPress = () => {
    // TODO: implement
  }

  const artworks = extractNodes(notificationData.artworksConnection)

  return (
    <Screen>
      <Screen.Header
        onBack={goBack}
        title="Alerts"
        rightElements={
          <Touchable>
            <Text variant="sm" onPress={handleEditPress}>
              Edit Alert
            </Text>
          </Touchable>
        }
      />

      <Flex m={2}>
        <Text variant="lg-display" mb={2}>
          {message}
        </Text>

        <Text>Alert ID: {item?.alert?.internalID}</Text>

        <FlashList
          estimatedItemSize={400}
          data={artworks}
          keyExtractor={(item) => item.internalID}
          ItemSeparatorComponent={() => <Flex mt={4} />}
          renderItem={({ item }) => {
            return (
              <ArtworkRailCard
                testID={`artwork-${item.slug}`}
                artwork={item}
                showPartnerName
                onPress={() => {
                  // TODO: Add tracking if needed

                  if (item.href) {
                    navigate(item.href)
                  }
                }}
                showSaveIcon
                size="fullWidth"
                metaContainerStyles={{
                  paddingHorizontal: space(2),
                }}
              />
            )
          }}
        />
      </Flex>
    </Screen>
  )
}

export const alertNotificationFragment = graphql`
  fragment AlertNotification_notification on Notification {
    message
    artworksConnection(first: 10) {
      edges {
        node {
          internalID
          slug
          href
          ...ArtworkRailCard_artwork @arguments(width: 590)
        }
      }
    }
    item {
      ... on AlertNotificationItem {
        alert {
          internalID
        }
      }
    }
  }
`
