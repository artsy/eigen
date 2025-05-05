import { Flex, Screen, Spacer, Spinner } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { captureMessage } from "@sentry/react-native"
import { AlertsList_me$data, AlertsList_me$key } from "__generated__/AlertsList_me.graphql"
import { ALERTS_PAGE_SIZE } from "app/Components/constants"
import { FavoritesContextStore } from "app/Scenes/Favorites/FavoritesContextStore"
import { useFavoritesTracking } from "app/Scenes/Favorites/useFavoritesTracking"
import {
  AlertBottomSheet,
  BottomSheetAlert,
} from "app/Scenes/SavedSearchAlertsList/Components/AlertBottomSheet"
import { EmptyMessage } from "app/Scenes/SavedSearchAlertsList/Components/EmptyMessage"
import { SavedSearchListItem } from "app/Scenes/SavedSearchAlertsList/Components/SavedSearchListItem"
import { extractNodes } from "app/utils/extractNodes"
import { RefreshEvents, SAVED_ALERT_REFRESH_KEY } from "app/utils/refreshHelpers"
import React, { useEffect, useRef, useState } from "react"
import { graphql, usePaginationFragment } from "react-relay"

interface AlertsListProps {
  me: AlertsList_me$data
  isRefreshing: boolean
  fetchingMore: boolean
  onRefresh: () => void
  onLoadMore: () => void
  onAlertPress: (alert: BottomSheetAlert) => void
}

export const AlertsList: React.FC<AlertsListProps> = (props) => {
  const { me, isRefreshing, fetchingMore, onRefresh, onLoadMore, onAlertPress } = props
  const { headerHeight } = FavoritesContextStore.useStoreState((state) => state)

  // enriching the items with the isSwipingActive state to manage the swipe-to-delete animation
  const [items, setItems] = useState(
    extractNodes(me.alertsConnection).map((node) => ({
      ...node,
      isSwipingActive: false,
      isDeleted: false,
    }))
  )

  useEffect(() => {
    RefreshEvents.addListener(SAVED_ALERT_REFRESH_KEY, onRefresh)

    return () => {
      RefreshEvents.removeListener(SAVED_ALERT_REFRESH_KEY, onRefresh)
    }
  }, [])

  useEffect(() => {
    setItems(
      extractNodes(me.alertsConnection).map((node) => ({
        ...node,
        isSwipingActive: false,
        isDeleted: false,
      }))
    )
  }, [me.alertsConnection])

  return (
    <Screen.FlatList
      data={items.filter((item) => !item.isDeleted)}
      keyExtractor={(item) => item.internalID}
      refreshing={isRefreshing}
      ListEmptyComponent={<EmptyMessage />}
      onRefresh={onRefresh}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => {
        return (
          <SavedSearchListItem
            key={item.internalID}
            alert={item}
            displayImage
            onPress={(alert) => {
              const artworksCount = alert.artworksConnection?.counts?.total ?? 0
              onAlertPress({
                id: alert.internalID,
                title: alert.title,
                artworksCount: artworksCount,
              })
            }}
            onDelete={() => {
              const newAlert = { ...item, isDeleted: true }
              setItems((prevItems) =>
                prevItems.map((item) => (item.internalID === newAlert.internalID ? newAlert : item))
              )
            }}
            onSwipeBegin={(id) => {
              // reset swiping state for all items that are not the one being swiped
              setItems((prevItems) =>
                prevItems.map((item) => ({
                  ...item,
                  isSwipingActive: item.internalID === id ? true : false,
                }))
              )
            }}
          />
        )
      }}
      onEndReached={onLoadMore}
      ListFooterComponent={
        fetchingMore ? (
          <Flex mt={2} mb={6} flexDirection="row" justifyContent="center">
            <Spinner />
          </Flex>
        ) : (
          <Spacer y={6} />
        )
      }
      contentContainerStyle={{ paddingTop: headerHeight }}
    />
  )
}

interface AlertsListPaginationContainerProps {
  me: AlertsList_me$key
}

export const AlertsListPaginationContainer: React.FC<AlertsListPaginationContainerProps> = ({
  me,
}) => {
  const { data, loadNext, isLoadingNext, refetch, hasNext } = usePaginationFragment(
    alertsListFragment,
    me
  )

  const isFocused = useIsFocused()
  const initialRender = useRef(true)

  const [selectedAlert, setSelectedAlert] = useState<BottomSheetAlert | null>(null)

  const { trackTappedAlertsGroup } = useFavoritesTracking()

  // We want to make sure that the list is refreshed when the screen is focused
  // This is needed to make sure we don't show deleted alerts
  useEffect(() => {
    if (isFocused && !initialRender.current) {
      onRefresh()
    }
    initialRender.current = false
  }, [isFocused])

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(ALERTS_PAGE_SIZE, {
      onComplete: (error) => {
        if (error) {
          if (__DEV__) {
            console.error(error)
          } else {
            captureMessage(`AlertsListPaginationContainer loadMore ${error.message}`)
          }
        }
      },
    })
  }

  const onRefresh = () => {
    refetch(
      {},
      {
        onComplete: () => {},
        fetchPolicy: "store-and-network",
      }
    )
  }

  return (
    <Flex flex={1}>
      <AlertsList
        me={data}
        fetchingMore={isLoadingNext}
        isRefreshing={isLoadingNext}
        onRefresh={onRefresh}
        onLoadMore={handleLoadMore}
        onAlertPress={(alert: BottomSheetAlert) => {
          setSelectedAlert(alert)
          trackTappedAlertsGroup(alert.id)
        }}
      />

      {!!selectedAlert && (
        <AlertBottomSheet
          alert={selectedAlert}
          onDismiss={() => {
            setSelectedAlert(null)
          }}
        />
      )}
    </Flex>
  )
}

const alertsListFragment = graphql`
  fragment AlertsList_me on Me
  @refetchable(queryName: "AlertsList_meRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
    alertsConnection(first: $count, after: $cursor, sort: ENABLED_AT_DESC)
      @connection(key: "AlertsList_alertsConnection") {
      edges {
        node {
          internalID
          ...SavedSearchListItem_alert
        }
      }
    }
  }
`
