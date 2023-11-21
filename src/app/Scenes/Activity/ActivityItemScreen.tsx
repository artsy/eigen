import { Box, Flex, SkeletonBox, Spacer, Text, useTheme } from "@artsy/palette-mobile"
import {
  ActivityItemScreenQuery,
  ActivityItemScreenQuery$data,
} from "__generated__/ActivityItemScreenQuery.graphql"
import {
  ActivityItemArtworksGrid,
  ActivityItemArtworksGridPlaceholder,
} from "app/Scenes/Activity/ActivityItemArtworksGrid"
import { ActivityItemTypeLabel } from "app/Scenes/Activity/ActivityItemTypeLabel"
import { navigateToActivityItem } from "app/Scenes/Activity/utils/navigateToActivityItem"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { FC } from "react"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"

interface ActivityItemScreenProps {
  me: ActivityItemScreenQuery$data["me"]
}

const PlaceholderComponent: FC = () => {
  const { space } = useTheme()
  const { bottom: bottomInset } = useSafeAreaInsets()

  return (
    <Flex flex={1}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: space(6),
          paddingBottom: bottomInset,
          paddingHorizontal: space(2),
        }}
      >
        <ActivityItemPlaceholder />

        <Spacer y={2} />

        <ActivityItemArtworksGridPlaceholder />

        <Flex flex={1}>
          <Text underline textAlign="center">
            View more
          </Text>
        </Flex>
      </ScrollView>
    </Flex>
  )
}

const ActivityItemScreen: FC<ActivityItemScreenProps> = ({ me }) => {
  const { space } = useTheme()
  const { bottom: bottomInset } = useSafeAreaInsets()
  const notification = me?.notification

  if (!notification) {
    return null
  }

  return (
    <Flex flex={1}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: space(6),
          paddingBottom: bottomInset,
          paddingHorizontal: space(2),
        }}
      >
        <Flex flexDirection="row">
          <ActivityItemTypeLabel notificationType={notification.notificationType} />

          <Text variant="xs" color="black60">
            {notification.publishedAt}
          </Text>
        </Flex>

        <Text variant="sm-display" fontWeight="bold">
          {notification.title}
        </Text>

        <Text variant="sm-display">{notification.message}</Text>

        <Spacer y={2} />

        <ActivityItemArtworksGrid notification={notification} />

        <Flex flex={1}>
          <Text
            underline
            textAlign="center"
            onPress={() => {
              navigateToActivityItem(notification.targetHref)
            }}
          >
            View more
          </Text>
        </Flex>
      </ScrollView>
    </Flex>
  )
}

interface ActivityItemScreenQueryRendererProps {
  notificationID: string
}

export const ActivityItemScreenQueryRenderer: FC<ActivityItemScreenQueryRendererProps> =
  withSuspense(({ notificationID }) => {
    const data = useLazyLoadQuery<ActivityItemScreenQuery>(ActivityItemQuery, {
      internalID: notificationID,
    })

    if (!data.me?.notification) {
      return null
    }

    return <ActivityItemScreen me={data.me} />
  }, PlaceholderComponent)

const ActivityItemQuery = graphql`
  query ActivityItemScreenQuery($internalID: String!) {
    me {
      notification(id: $internalID) {
        title
        message
        notificationType
        publishedAt(format: "RELATIVE")
        targetHref
        ...ActivityItemArtworksGrid_notification
      }
    }
  }
`

const ActivityItemPlaceholder = () => {
  return (
    <Box>
      <SkeletonBox width={30} height={20} />
      <Spacer y={0.5} />
      <SkeletonBox width={130} height={15} />
      <Spacer y={0.5} />
      <SkeletonBox width={100} height={15} />
    </Box>
  )
}
