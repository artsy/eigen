import { ActivityContentQuery } from "__generated__/ActivityContentQuery.graphql"
import { useMarkNotificationsAsSeen } from "app/Scenes/Activity/hooks/useMarkNotificationsAsSeen"
import { Fragment } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ActivityList } from "./ActivityList"
import { NotificationType } from "./types"
import { getNotificationTypes } from "./utils/getNotificationTypes"
import { Box, Flex, Separator, SkeletonBox, Spacer } from "@artsy/palette-mobile"
import { times } from "lodash"

interface ActivityProps {
  type: NotificationType
}

export const ActivityContent: React.FC<ActivityProps> = ({ type }) => {
  const types = getNotificationTypes(type)

  const queryData = useLazyLoadQuery<ActivityContentQuery>(
    activityContentQuery,
    {
      count: 10,
      types,
    },
    {
      fetchPolicy: "store-and-network",
    }
  )

  useMarkNotificationsAsSeen()

  return <ActivityList viewer={queryData.viewer} type={type} />
}

const activityContentQuery = graphql`
  query ActivityContentQuery($count: Int, $after: String, $types: [NotificationTypesEnum]) {
    viewer {
      ...ActivityList_viewer @arguments(count: $count, after: $after, types: $types)
    }
  }
`

export const ActivityContentPlaceholder = () => {
  return (
    <Flex flex={1}>
      <Separator borderColor="black5" />

      <Box mx={2}>
        {times(3).map((index) => (
          <Fragment key={`placeholder-item-${index}`}>
            <ActivityItemPlaceholder />

            <Flex mx={-2}>
              <Separator borderColor="black5" />
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
