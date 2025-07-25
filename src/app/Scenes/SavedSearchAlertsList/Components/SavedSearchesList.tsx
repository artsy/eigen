import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { BellStrokeIcon, FilterIcon, TrendingIcon } from "@artsy/icons/native"
import {
  Flex,
  Join,
  LinkText,
  Screen,
  Separator,
  Spacer,
  Spinner,
  Text,
  useTheme,
} from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { SavedSearchesList_me$data } from "__generated__/SavedSearchesList_me.graphql"
import { InfoButton } from "app/Components/Buttons/InfoButton"
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
import { useTracking } from "react-tracking"
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
    return (
      <Flex pt={4}>
        <EmptyMessage />
      </Flex>
    )
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
      ItemSeparatorComponent={() => <Separator borderColor="mono5" />}
      renderItem={({ item }) => {
        return (
          <SavedSearchListItem
            alert={item}
            isSwipingActive={item.isSwipingActive}
            onPress={(alert) => {
              if (!!enableTapToShowBottomSheet) {
                const artworksCount = alert.artworksConnection?.counts?.total ?? 0

                onAlertPress({
                  id: alert.internalID,
                  title: alert.title,
                  artworksCount: artworksCount,
                })
              } else {
                navigate(`favorites/alerts/${alert.internalID}/edit`)
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
  const tracking = useTracking()

  const handleCloseModal = () => {
    setModalVisible(false)

    // onDismiss doesn't get called on TEST Environments so we need to manually call it
    if (__TEST__) {
      handleSortByModalClosed()
    }
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

  const infoButtonRef = useRef<{ closeModal: () => void } | null>(null)

  const handleNavigate = () => {
    tracking.trackEvent(tracks.tapActivityLink())

    infoButtonRef.current?.closeModal()

    requestAnimationFrame(() => {
      navigate("/notifications")
    })
  }

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
          rightElements={<SortButton testID="sortButton" onPress={() => setModalVisible(true)} />}
        />

        <Flex px={2}>
          <InfoButton
            ref={infoButtonRef}
            trackEvent={() => {
              tracking.trackEvent(tracks.tapAlertsInfo())
            }}
            titleElement={
              <Text variant="lg-display" mr={1}>
                Alerts
              </Text>
            }
            modalTitle="Alerts"
            modalContent={
              <Join separator={<Spacer y={2} />}>
                <Flex flexDirection="row" alignItems="flex-start">
                  <BellStrokeIcon mr={0.5} />
                  <Flex flex={1}>
                    <Text variant="sm-display">
                      If you’re on the hunt for a particular artwork, create an Alert and we’ll
                      notify you when there’s a match.
                    </Text>
                  </Flex>
                </Flex>
                <Flex flexDirection="row" alignItems="flex-start">
                  <TrendingIcon mr={0.5} />
                  <Flex flex={1}>
                    <Text variant="sm-display">
                      Stay informed through emails, push notifications, or within{" "}
                      <LinkText onPress={handleNavigate}>Activity</LinkText>.
                    </Text>
                  </Flex>
                </Flex>
                <Flex flexDirection="row" alignItems="flex-start">
                  <FilterIcon mr={0.5} />
                  <Flex flex={1}>
                    <Text variant="sm-display">
                      Customize Alerts to match your budget, preferred medium, rarity or other
                      criteria.
                    </Text>
                  </Flex>
                </Flex>
              </Join>
            }
          />
        </Flex>

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
              ...SavedSearchListItem_alert
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

const tracks = {
  tapAlertsInfo: (): TappedInfoBubble => ({
    action: ActionType.tappedInfoBubble,
    context_module: ContextModule.alertsList,
    context_screen_owner_type: OwnerType.alerts,
    subject: "alertsHeader",
  }),
  tapActivityLink: () => ({
    action: ActionType.tappedLink,
    context_module: ContextModule.alertsList,
    context_screen_owner_type: OwnerType.alertsInfoModal,
    type: "link",
  }),
}
