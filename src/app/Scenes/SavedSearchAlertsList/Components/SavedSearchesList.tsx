import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Separator, Spinner, useTheme } from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { SavedSearchesList_me$data } from "__generated__/SavedSearchesList_me.graphql"
import { SortByModal, SortOption } from "app/Components/SortByModal/SortByModal"
import { SAVED_SERCHES_PAGE_SIZE } from "app/Components/constants"
import {
  AlertBottomSheet,
  BottomSheetAlert,
} from "app/Scenes/SavedSearchAlertsList/Components/AlertBottomSheet"
import { GoBackProps, goBack, navigate, navigationEvents } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { RefreshEvents, SAVED_ALERT_REFRESH_KEY } from "app/utils/refreshHelpers"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useEffect, useRef, useState } from "react"
import { RelayPaginationProp, createPaginationContainer, graphql } from "react-relay"
import usePrevious from "react-use/lib/usePrevious"
import { EmptyMessage } from "./EmptyMessage"
import { SavedSearchAlertsListPlaceholder } from "./SavedSearchAlertsListPlaceholder"
import { SavedSearchListItem } from "./SavedSearchListItem"
import { SortButton } from "./SortButton"

type RefreshType = "default" | "delete"

interface SavedSearchListWrapperProps {
  me: SavedSearchesList_me$data
  relay: RelayPaginationProp
}

interface SavedSearchesListProps extends SavedSearchListWrapperProps {
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

export const SavedSearchesList: React.FC<SavedSearchesListProps> = (props) => {
  const { me, fetchingMore, refreshMode, onRefresh, onLoadMore, onAlertPress } = props
  const { space } = useTheme()
  const enableTapToShowBottomSheet = useFeatureFlag("AREnableAlertBottomSheet")
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
        <SavedSearchAlertsListPlaceholder />
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
      ItemSeparatorComponent={() => <Separator borderColor="black5" />}
      renderItem={({ item }) => {
        return (
          <SavedSearchListItem
            id={item.internalID}
            title={item.title}
            subtitle={item.subtitle}
            isSwipingActive={item.isSwipingActive}
            onPress={() => {
              if (!!enableTapToShowBottomSheet) {
                const artworksCount = item.artworksConnection?.counts?.total ?? 0

                onAlertPress({
                  id: item.internalID,
                  title: item.title,
                  artworksCount: artworksCount,
                })
              } else {
                navigate(`settings/alerts/${item.internalID}/edit`)
              }
            }}
            onDelete={(id) => {
              // remove item from the list
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

export const SavedSearchesListWrapper: React.FC<SavedSearchListWrapperProps> = (props) => {
  const { relay } = props

  const enableTapToShowBottomSheet = useFeatureFlag("AREnableAlertBottomSheet")
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<BottomSheetAlert | null>(null)
  const [selectedSortValue, setSelectedSortValue] = useState("ENABLED_AT_DESC")
  const prevSelectedSortValue = usePrevious(selectedSortValue)
  const [fetchingMore, setFetchingMore] = useState(false)
  const [refreshMode, setRefreshMode] = useState<RefreshType | null>(null)

  const handleCloseModal = () => {
    setModalVisible(false)
  }

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
    handleCloseModal()
  }

  /**
   * If we call `refetch` immediately after we have specified sort value,
   * we get "freeze" screen on which nothing can be clicked or scrolled.
   * For this reason, we call `refetch` only after the modal is closed completely.
   *
   * More context here: https://github.com/facebook/react-native/issues/16182#issuecomment-333814201
   */
  const handleSortByModalClosed = () => {
    if (selectedSortValue === prevSelectedSortValue) {
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
      <Screen>
        <Screen.AnimatedHeader
          onBack={goBack}
          title="Alerts"
          rightElements={<SortButton onPress={() => setModalVisible(true)} />}
        />

        <Screen.StickySubHeader title="Alerts" />

        <Screen.Body fullwidth>
          <SavedSearchesList
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
            onCloseModal={handleCloseModal}
            onSelectOption={handleSelectOption}
            onModalFinishedClosing={handleSortByModalClosed}
          />
          {!!enableTapToShowBottomSheet && !!selectedAlert && (
            <AlertBottomSheet
              alert={selectedAlert}
              onDismiss={() => {
                setSelectedAlert(null)
              }}
            />
          )}
        </Screen.Body>
      </Screen>
    </ProvideScreenTracking>
  )
}

export const SavedSearchesListPaginationContainer = createPaginationContainer(
  SavedSearchesListWrapper,
  {
    me: graphql`
      fragment SavedSearchesList_me on Me
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
        sort: { type: "AlertsConnectionSortEnum", defaultValue: ENABLED_AT_DESC }
      ) {
        alertsConnection(first: $count, after: $cursor, sort: $sort)
          @connection(key: "SavedSearches_alertsConnection") {
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
      query SavedSearchesListQuery($count: Int!, $cursor: String, $sort: AlertsConnectionSortEnum) {
        me {
          ...SavedSearchesList_me @arguments(count: $count, cursor: $cursor, sort: $sort)
        }
      }
    `,
  }
)
