import { Flex, Screen, SortIcon, Spacer, Spinner, Text, Touchable } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { captureMessage } from "@sentry/react-native"
import { AlertsList_me$data, AlertsList_me$key } from "__generated__/AlertsList_me.graphql"
import { ALERTS_PAGE_SIZE } from "app/Components/constants"
import { AlertsSortByModal, SortOption } from "app/Scenes/Favorites/Components/AlertsSortByModal"
import {
  AlertBottomSheet,
  BottomSheetAlert,
} from "app/Scenes/SavedSearchAlertsList/Components/AlertBottomSheet"
import { EmptyMessage } from "app/Scenes/SavedSearchAlertsList/Components/EmptyMessage"
import { SavedSearchListItem } from "app/Scenes/SavedSearchAlertsList/Components/SavedSearchListItem"
import { extractNodes } from "app/utils/extractNodes"
import { RefreshEvents, SAVED_ALERT_REFRESH_KEY } from "app/utils/refreshHelpers"
import React, { useEffect, useRef, useState } from "react"
import { InteractionManager } from "react-native"
import { graphql, usePaginationFragment } from "react-relay"
import usePrevious from "react-use/lib/usePrevious"

interface AlertsListProps {
  me: AlertsList_me$data
  isRefreshing: boolean
  fetchingMore: boolean
  onRefresh: () => void
  onLoadMore: () => void
  onAlertPress: (alert: BottomSheetAlert) => void
}

const SORT_OPTIONS: SortOption[] = [
  { value: "ENABLED_AT_DESC", text: "Recently Added" },
  { value: "NAME_ASC", text: "Name (A-Z)" },
]

export const AlertsList: React.FC<AlertsListProps> = (props) => {
  const { me, isRefreshing, fetchingMore, onRefresh, onLoadMore, onAlertPress } = props
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

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<BottomSheetAlert | null>(null)
  const [selectedSortValue, setSelectedSortValue] = useState("ENABLED_AT_DESC")
  const prevSelectedSortValue = usePrevious(selectedSortValue)

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
      {
        sort: selectedSortValue,
      },
      {
        onComplete: () => {},
        fetchPolicy: "store-and-network",
      }
    )
  }

  const handleSelectOption = (option: SortOption) => {
    setSelectedSortValue(option.value)
    setModalVisible(false)
  }

  /**
   * If we call `refetch` immediately after we have specified sort value,
   * we get "freeze" screen on which nothing can be clicked or scrolled.
   * For this reason, we call `refetch` only after the modal is closed completely.
   *
   * More context here: https://github.com/facebook/react-native/issues/16182#issuecomment-333814201
   */
  const handleSortByModalClosed = () => {
    setModalVisible(false)

    if (selectedSortValue === prevSelectedSortValue) {
      return
    }

    InteractionManager.runAfterInteractions(() => {
      refetch(
        {
          sort: selectedSortValue,
        },
        {
          onComplete: () => {},
          // We intentionally want to fetch the data from the network to avoid showing stale data
          // Then removing it from the screen. This is mostly visible when the user switches between
          // Sort modes
          fetchPolicy: "network-only",
        }
      )
    })
  }

  return (
    <Flex flex={1}>
      <Touchable
        onPress={() => {
          setModalVisible(true)
        }}
      >
        <AlertsListSortByHeader />
      </Touchable>

      <AlertsList
        me={data}
        fetchingMore={isLoadingNext}
        isRefreshing={isLoadingNext}
        onRefresh={onRefresh}
        onLoadMore={handleLoadMore}
        onAlertPress={(alert: BottomSheetAlert) => {
          setSelectedAlert(alert)
        }}
      />

      <AlertsSortByModal
        visible={modalVisible}
        options={SORT_OPTIONS}
        selectedValue={selectedSortValue}
        onSelectOption={handleSelectOption}
        onModalFinishedClosing={handleSortByModalClosed}
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

export const AlertsListSortByHeader: React.FC<{}> = () => {
  return (
    <Flex flexDirection="row" alignItems="center" mx={2} mb={1}>
      <Text variant="sm-display" mr={0.5}>
        Sort By
      </Text>
      <SortIcon />
    </Flex>
  )
}

const alertsListFragment = graphql`
  fragment AlertsList_me on Me
  @refetchable(queryName: "AlertsList_meRefetch")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    cursor: { type: "String" }
    sort: { type: "AlertsConnectionSortEnum", defaultValue: ENABLED_AT_DESC }
  ) {
    alertsConnection(first: $count, after: $cursor, sort: $sort)
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
