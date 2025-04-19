import { Box, Flex, Separator, SkeletonBox, Spacer } from "@artsy/palette-mobile"
import { ActivityContentQuery } from "__generated__/ActivityContentQuery.graphql"
import { useMarkNotificationsAsSeen } from "app/Scenes/Activity/hooks/useMarkNotificationsAsSeen"
import { times } from "lodash"
import { Fragment } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ActivityList } from "./ActivityList"
import { NotificationType } from "./types"
import { getNotificationTypes } from "./utils/getNotificationTypes"

interface ActivityProps {
  type: NotificationType
}

export const ActivityContent: React.FC<ActivityProps> = ({ type }) => {
  const types = getNotificationTypes(type)

  const queryData = useLazyLoadQuery<ActivityContentQuery>(
    activityContentQuery,
    {
      types,
    },
    {
      fetchPolicy: "store-and-network",
    }
  )

  useMarkNotificationsAsSeen()

  return <ActivityList viewer={queryData.viewer} type={type} />
}

export const activityContentQuery = graphql`
  query ActivityContentQuery(
    $count: Int = 10
    $after: String
    $types: [NotificationTypesEnum] = []
  ) {
    viewer {
      ...ActivityList_viewer @arguments(count: $count, after: $after, types: $types)
    }
  }
`

export const ActivityContentPlaceholder = () => {
  return (
    <Flex flex={1} testID="activity-content-placeholder">
      <Separator borderColor="mono5" />

      <Box mx={2}>
        {times(3).map((index) => (
          <Fragment key={`placeholder-item-${index}`}>
            <ActivityItemPlaceholder />

            <Flex mx={-2}>
              <Separator borderColor="mono5" />
            </Flex>
          </Fragment>
        ))}
      </Box>
    </Flex>
  )
}

const ActivityItemPlaceholder = () => {
  return (
    <Box my={2}>
      <Flex flexDirection="row">
        <SkeletonBox width={55} height={55} />
        <Spacer x={1} />
        <SkeletonBox width={55} height={55} />
        <Spacer x={1} />
        <SkeletonBox width={55} height={55} />
        <Spacer x={1} />
      </Flex>
      <Spacer y={1} />
      <SkeletonBox width={130} height={15} />
      <Spacer y={0.5} />
      <SkeletonBox width={100} height={15} />
      <Spacer y={1} />
    </Box>
  )
}
