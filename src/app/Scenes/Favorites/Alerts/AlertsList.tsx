import { OwnerType } from "@artsy/cohesion"
import {
  ArrowDownIcon,
  Flex,
  Screen,
  Spinner,
  Text,
  Touchable,
  useTheme,
} from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { AlertsList_me$data } from "__generated__/AlertsList_me.graphql"
import { SAVED_SERCHES_PAGE_SIZE } from "app/Components/constants"
import { AlertsListPlaceholder } from "app/Scenes/Favorites/Alerts/AlertsListPlaceholder"
import { SortByModal, SortOption } from "app/Scenes/Favorites/Alerts/SortByModal"
import {
  AlertBottomSheet,
  BottomSheetAlert,
} from "app/Scenes/SavedSearchAlertsList/Components/AlertBottomSheet"
import { EmptyMessage } from "app/Scenes/SavedSearchAlertsList/Components/EmptyMessage"
import { SavedSearchListItem } from "app/Scenes/SavedSearchAlertsList/Components/SavedSearchListItem"
import { GoBackProps, navigationEvents } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { RefreshEvents, SAVED_ALERT_REFRESH_KEY } from "app/utils/refreshHelpers"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useEffect, useRef, useState } from "react"
import { RelayPaginationProp, createPaginationContainer, graphql } from "react-relay"
import usePrevious from "react-use/lib/usePrevious"

type RefreshType = "default" | "delete"

interface AlertsListWrapperProps {
  me: AlertsList_me$data
  relay: RelayPaginationProp
}

interface AlertsListProps extends AlertsListWrapperProps {
  refreshMode: RefreshType | null
  fetchingMore: boolean
  onRefresh: (type: RefreshType) => void
  onLoadMore: () => void
  onAlertPress: (alert: BottomSheetAlert) => void
}

const SORT_OPTIONS: SortOption[] = [
  { value: "ENABLED_AT_DESC", text: "Recently Added" },
  { value: "NAME_ASC", text: "Name (A-Z)" },
]

export const AlertsList: React.FC<AlertsListProps> = (props) => {
  const { me, fetchingMore, refreshMode, onRefresh, onLoadMore, onAlertPress } = props
  const { space } = useTheme()
  const [items, setItems] = useState(
    extractNodes(me.alertsConnection).map((node) => ({ ...node, isSwipingActive: false }))
  )

  const refresh = () => {
    onRefresh("default")
  }

  useEffect(() => {
    RefreshEvents.addListener(SAVED_ALERT_REFRESH_KEY, refresh)

    return () => {
      RefreshEvents.removeListener(SAVED_ALERT_REFRESH_KEY, refresh)
    }
  }, [])

  useEffect(() => {
    setItems(extractNodes(me.alertsConnection).map((node) => ({ ...node, isSwipingActive: false })))
  }, [me.alertsConnection])

  if (refreshMode === "delete") {
    return (
      <ProvidePlaceholderContext>
        <AlertsListPlaceholder />
      </ProvidePlaceholderContext>
    )
  }

  if (items.length === 0) {
    return <EmptyMessage />
  }

  return (
    <Screen.FlatList
      data={items}
      keyExtractor={(item) => item.internalID}
      contentContainerStyle={{ paddingTop: space(1) }}
      refreshing={refreshMode !== null}
      onRefresh={() => {
        onRefresh("default")
      }}
      renderItem={({ item }) => {
        const image = item.artworksConnection?.edges?.[0]?.node?.image

        return (
          <SavedSearchListItem
            id={item.internalID}
            title={item.title}
            subtitle={item.subtitle}
            isSwipingActive={item.isSwipingActive}
            displayImage={true}
            image={{
              url: image?.resized?.url ?? "",
              blurhash: image?.blurhash ?? "",
            }}
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
        ) : null
      }
    />
  )
}

export const AlertsListWrapper: React.FC<AlertsListWrapperProps> = (props) => {
  const { relay } = props

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<BottomSheetAlert | null>(null)
  const [selectedSortValue, setSelectedSortValue] = useState("ENABLED_AT_DESC")
  const prevSelectedSortValue = usePrevious(selectedSortValue)
  const [fetchingMore, setFetchingMore] = useState(false)
  const [refreshMode, setRefreshMode] = useState<RefreshType | null>(null)

  const handleLoadMore = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    setFetchingMore(true)
    relay.loadMore(SAVED_SERCHES_PAGE_SIZE, (error) => {
      if (error) {
        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(`SavedSearchesListWrapper loadMore ${error.message}`)
        }
      }

      setFetchingMore(false)
    })
  }

  const onRefresh = (type: RefreshType) => {
    setRefreshMode(type)

    relay.refetchConnection(
      SAVED_SERCHES_PAGE_SIZE,
      (error) => {
        if (error) {
          console.error(error)
        }

        setRefreshMode(null)
      },
      {
        sort: selectedSortValue,
      }
    )
  }

  const refreshRef = useRef(onRefresh)
  refreshRef.current = onRefresh

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

    if (selectedSortValue === prevSelectedSortValue && !__TEST__) {
      return
    }

    onRefresh("delete")
  }

  useEffect(() => {
    const onDeleteRefresh = (backProps?: GoBackProps) => {
      if (backProps?.previousScreen === "EditSavedSearchAlert") {
        refreshRef.current("delete")
      }
    }

    navigationEvents.addListener("goBack", onDeleteRefresh)

    return () => {
      navigationEvents.removeListener("goBack", onDeleteRefresh)
    }
  }, [])

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
          <Flex flexDirection="row" alignItems="center" mx={2} mt={2}>
            <ArrowDownIcon />
            <Text ml={0.5}>Sort By</Text>
          </Flex>
        </Touchable>
        <AlertsList
          {...props}
          fetchingMore={fetchingMore}
          refreshMode={refreshMode}
          onRefresh={onRefresh}
          onLoadMore={handleLoadMore}
          onAlertPress={(alert: BottomSheetAlert) => {
            setSelectedAlert(alert)
          }}
        />

        <SortByModal
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

export const AlertsListPaginationContainer = createPaginationContainer(
  AlertsListWrapper,
  {
    me: graphql`
      fragment AlertsList_me on Me
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
    `,
  },
  {
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    getConnectionFromProps(props) {
      return props.me.alertsConnection
    },
    query: graphql`
      query AlertsListQuery($count: Int!, $cursor: String, $sort: AlertsConnectionSortEnum) {
        me {
          ...AlertsList_me @arguments(count: $count, cursor: $cursor, sort: $sort)
        }
      }
    `,
  }
)
