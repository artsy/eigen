import { ActionType } from "@artsy/cohesion"
import { ClickedActivityPanelTab } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import {
  ActivityMarkNotificationsAsSeenMutation,
  ActivityMarkNotificationsAsSeenMutation$data,
} from "__generated__/ActivityMarkNotificationsAsSeenMutation.graphql"
import { ActivityQuery } from "__generated__/ActivityQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { StickyTabPage, TabProps } from "app/Components/StickyTabPage/StickyTabPage"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { DateTime } from "luxon"
import { Flex } from "palette"
import { Suspense, useEffect } from "react"
import { graphql, useLazyLoadQuery, useMutation } from "react-relay"
import { useTracking } from "react-tracking"
import { RecordSourceSelectorProxy } from "relay-runtime"
import { ActivityList } from "./ActivityList"
import { ActivityTabPlaceholder } from "./ActivityTabPlaceholder"
import { NotificationType } from "./types"
import { getNotificationTypes } from "./utils/getNotificationTypes"

interface ActivityProps {
  type: NotificationType
}

export const ActivityContent: React.FC<ActivityProps> = ({ type }) => {
  const types = getNotificationTypes(type)
  const [commit] = useMutation<ActivityMarkNotificationsAsSeenMutation>(
    MarkNotificationsAsSeenMutation
  )
  const queryData = useLazyLoadQuery<ActivityQuery>(
    ActivityScreenQuery,
    {
      count: 10,
      types,
    },
    {
      fetchPolicy: "store-and-network",
    }
  )

  useEffect(() => {
    const updater = (
      store: RecordSourceSelectorProxy<ActivityMarkNotificationsAsSeenMutation$data>
    ) => {
      const root = store.getRoot()
      const me = root.getLinkedRecord("me")

      // Set unseen notifications count to 0
      me?.setValue(0, "unseenNotificationsCount")
    }

    commit({
      variables: {
        input: {
          until: DateTime.local().toISO(),
        },
      },
      updater,
      optimisticUpdater: updater,
      onCompleted: (response) => {
        const result = response.markNotificationsAsSeen?.responseOrError
        const errorMessage = result?.mutationError?.message

        if (errorMessage) {
          throw new Error(errorMessage)
        }

        GlobalStore.actions.bottomTabs.setDisplayUnseenNotificationsIndicator(false)
      },
    })
  }, [])

  return <ActivityList viewer={queryData.viewer} me={queryData.me} type={type} />
}

export const ActivityContainer: React.FC<ActivityProps> = (props) => {
  return (
    <Suspense fallback={<ActivityTabPlaceholder />}>
      <ActivityContent {...props} />
    </Suspense>
  )
}

export const Activity = () => {
  const tracking = useTracking()

  const tabs: TabProps[] = [
    {
      title: "All",
      content: <ActivityContainer type="all" />,
      initial: true,
    },
    {
      title: "Alerts",
      content: <ActivityContainer type="alerts" />,
    },
  ]

  const handleTabPress = (tabIndex: number) => {
    const tab = tabs[tabIndex]
    tracking.trackEvent(tracks.clickedActivityPanelTab(tab.title))
  }

  return (
    <Flex flex={1}>
      <StickyTabPage
        tabs={tabs}
        staticHeaderContent={
          <FancyModalHeader onLeftButtonPress={goBack} hideBottomDivider>
            Activity
          </FancyModalHeader>
        }
        disableBackButtonUpdate
        shouldTrackEventOnTabClick={false}
        onTabPress={handleTabPress}
      />
    </Flex>
  )
}

const ActivityScreenQuery = graphql`
  query ActivityQuery($count: Int, $after: String, $types: [NotificationTypesEnum]) {
    viewer {
      ...ActivityList_viewer @arguments(count: $count, after: $after, types: $types)
    }
    me {
      ...ActivityList_me
    }
  }
`

const MarkNotificationsAsSeenMutation = graphql`
  mutation ActivityMarkNotificationsAsSeenMutation($input: MarkNotificationsAsSeenInput!) {
    markNotificationsAsSeen(input: $input) {
      responseOrError {
        ... on MarkNotificationsAsSeenSuccess {
          success
        }
        ... on MarkNotificationsAsSeenFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`

const tracks = {
  clickedActivityPanelTab: (tabName: string): ClickedActivityPanelTab => ({
    action: ActionType.clickedActivityPanelTab,
    tab_name: tabName,
  }),
}
