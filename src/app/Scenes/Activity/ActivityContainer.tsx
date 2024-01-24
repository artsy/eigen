import { ActivityContainerQuery } from "__generated__/ActivityContainerQuery.graphql"
import { useMarkNotificationsAsSeen } from "app/Scenes/Activity/hooks/useMarkNotificationsAsSeen"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ActivityList } from "./ActivityList"
import { ActivityTabPlaceholder } from "./ActivityTabPlaceholder"
import { NotificationType } from "./types"
import { getNotificationTypes } from "./utils/getNotificationTypes"

interface ActivityProps {
  type: NotificationType
}

export const ActivityContainer: React.FC<ActivityProps> = (props) => {
  return (
    <Suspense fallback={<ActivityTabPlaceholder />}>
      <ActivityContent {...props} />
    </Suspense>
  )
}

export const ActivityContent: React.FC<ActivityProps> = ({ type }) => {
  const types = getNotificationTypes(type)
  const queryData = useLazyLoadQuery<ActivityContainerQuery>(
    activityContainerQuery,
    {
      count: 10,
      types,
    },
    {
      fetchPolicy: "store-and-network",
    }
  )

  useMarkNotificationsAsSeen()

  return <ActivityList viewer={queryData.viewer} me={queryData.me} type={type} />
}

const activityContainerQuery = graphql`
  query ActivityContainerQuery($count: Int, $after: String, $types: [NotificationTypesEnum]) {
    viewer {
      ...ActivityList_viewer @arguments(count: $count, after: $after, types: $types)
    }
    me {
      ...ActivityList_me
    }
  }
`
