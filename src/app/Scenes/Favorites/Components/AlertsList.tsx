import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, SortIcon, Spacer, Spinner, Text, Touchable } from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { AlertsList_me$data, AlertsList_me$key } from "__generated__/AlertsList_me.graphql"
import { SAVED_SERCHES_PAGE_SIZE } from "app/Components/constants"
import { AlertsSortByModal, SortOption } from "app/Scenes/Favorites/Components/AlertsSortByModal"
import {
  AlertBottomSheet,
  BottomSheetAlert,
} from "app/Scenes/SavedSearchAlertsList/Components/AlertBottomSheet"
import { EmptyMessage } from "app/Scenes/SavedSearchAlertsList/Components/EmptyMessage"
import { SavedSearchListItem } from "app/Scenes/SavedSearchAlertsList/Components/SavedSearchListItem"
import { extractNodes } from "app/utils/extractNodes"
import { RefreshEvents, SAVED_ALERT_REFRESH_KEY } from "app/utils/refreshHelpers"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useEffect, useState } from "react"
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
    extractNodes(me.alertsConnection).map((node) => ({ ...node, isSwipingActive: false }))
  )

  useEffect(() => {
    RefreshEvents.addListener(SAVED_ALERT_REFRESH_KEY, onRefresh)

    return () => {
      RefreshEvents.removeListener(SAVED_ALERT_REFRESH_KEY, onRefresh)
    }
  }, [])

  useEffect(() => {
    setItems(extractNodes(me.alertsConnection).map((node) => ({ ...node, isSwipingActive: false })))
  }, [me.alertsConnection])

  if (items.length === 0) {
    return <EmptyMessage />
  }

  return (
    <Screen.FlatList
      data={items}
      keyExtractor={(item) => item.internalID}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      renderItem={({ item }) => {
        const image = item.artworksConnection?.edges?.[0]?.node?.image
        const imageProps = {
          url: image?.resized?.url ?? "",
          blurhash: image?.blurhash ?? "",
        }

        return (
          <SavedSearchListItem
            id={item.internalID}
            title={item.title}
            subtitle={item.subtitle}
            isSwipingActive={item.isSwipingActive}
            displayImage={true}
            image={imageProps}
            onPress={() => {
              const artworksCount = item.artworksConnection?.counts?.total ?? 0

              onAlertPress({
                id: item.internalID,
                title: item.title,
                artworksCount: artworksCount,
              })
            }}
            onDelete={(id) => {
              setItems((prevItems) => prevItems.filter((item) => item.internalID !== id))
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
          <Flex alignItems="center" mt={2} mb={4}>
            <Spinner />
          </Flex>
        ) : (
          <Spacer y={4} />
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

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<BottomSheetAlert | null>(null)
  const [selectedSortValue, setSelectedSortValue] = useState("ENABLED_AT_DESC")
  const prevSelectedSortValue = usePrevious(selectedSortValue)
  const [fetchingMore, setFetchingMore] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    setFetchingMore(true)

    loadNext(SAVED_SERCHES_PAGE_SIZE, {
      onComplete: (error) => {
        if (error) {
          if (__DEV__) {
            console.error(error)
          } else {
            captureMessage(`AlertsListPaginationContainer loadMore ${error.message}`)
          }
        }

        setFetchingMore(false)
      },
    })
  }

  const onRefresh = () => {
    setIsRefreshing(true)

    refetch(
      {
        sort: selectedSortValue,
      },
      {
        onComplete: () => {
          setIsRefreshing(false)
        },
        fetchPolicy: "network-only",
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

    onRefresh()
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.SavedSearchList,
        context_screen_owner_type: OwnerType.savedSearch,
      }}
    >
      <Flex flexDirection="column">
        <Touchable
          onPress={() => {
            setModalVisible(true)
          }}
        >
          <Flex flexDirection="row" alignItems="center" mx={2}>
            <SortIcon />
            <Text variant="xs" ml={0.5}>
              Sort By
            </Text>
          </Flex>
        </Touchable>

        <AlertsList
          me={data}
          fetchingMore={fetchingMore}
          isRefreshing={isRefreshing}
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
    </ProvideScreenTracking>
  )
}

const alertsListFragment = graphql`
  fragment AlertsList_me on Me
  @refetchable(queryName: "AlertsList_meRefetch")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String" }
    sort: { type: "AlertsConnectionSortEnum", defaultValue: ENABLED_AT_DESC }
  ) {
    alertsConnection(first: $count, after: $cursor, sort: $sort)
      @connection(key: "AlertsList_alertsConnection") {
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
      edges {
        node {
          internalID
          artistSeriesIDs
          title: displayName(only: [artistIDs])
          subtitle: displayName(except: [artistIDs])
          artworksConnection(first: 1) {
            counts {
              total
            }
            edges {
              node {
                image {
                  resized(version: "larger", width: 60, height: 60) {
                    url
                  }
                  blurhash
                }
              }
            }
          }
        }
      }
    }
  }
`
