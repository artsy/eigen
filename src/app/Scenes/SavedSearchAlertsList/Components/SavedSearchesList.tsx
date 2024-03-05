import { OwnerType } from "@artsy/cohesion"
import { Flex, Spinner, useTheme } from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { SavedSearchesList_me$data } from "__generated__/SavedSearchesList_me.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { SortByModal, SortOption } from "app/Components/SortByModal/SortByModal"
import { SAVED_SERCHES_PAGE_SIZE } from "app/Components/constants"
import { GoBackProps, goBack, navigate, navigationEvents } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { RefreshEvents, SAVED_ALERT_REFRESH_KEY } from "app/utils/refreshHelpers"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useEffect, useRef, useState } from "react"
import { FlatList } from "react-native"
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
}

const SORT_OPTIONS: SortOption[] = [
  { value: "ENABLED_AT_DESC", text: "Recently Added" },
  { value: "NAME_ASC", text: "Name (A-Z)" },
]

export const SavedSearchesList: React.FC<SavedSearchesListProps> = (props) => {
  const { me, fetchingMore, refreshMode, onRefresh, onLoadMore } = props
  const { space } = useTheme()
  const items = extractNodes(me.alertsConnection)

  const refresh = () => {
    onRefresh("default")
  }

  useEffect(() => {
    RefreshEvents.addListener(SAVED_ALERT_REFRESH_KEY, refresh)
    return () => {
      RefreshEvents.removeListener(SAVED_ALERT_REFRESH_KEY, refresh)
    }
  }, [])

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
    <FlatList
      data={items}
      keyExtractor={(item) => item.internalID}
      contentContainerStyle={{ paddingVertical: space(1) }}
      refreshing={refreshMode !== null}
      onRefresh={() => {
        onRefresh("default")
      }}
      renderItem={({ item }) => {
        return (
          <SavedSearchListItem
            title={item.displayName}
            onPress={() => {
              navigate(`settings/alerts/${item.internalID}/edit`)
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

  const [modalVisible, setModalVisible] = useState(false)
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
      <FancyModalHeader
        hideBottomDivider
        onLeftButtonPress={goBack}
        onRightButtonPress={() => {
          setModalVisible(true)
        }}
        renderRightButton={() => {
          return <SortButton onPress={() => setModalVisible(true)} />
        }}
      >
        Alerts
      </FancyModalHeader>

      <SavedSearchesList
        {...props}
        fetchingMore={fetchingMore}
        refreshMode={refreshMode}
        onRefresh={onRefresh}
        onLoadMore={handleLoadMore}
      />
      <SortByModal
        visible={modalVisible}
        options={SORT_OPTIONS}
        selectedValue={selectedSortValue}
        onCloseModal={handleCloseModal}
        onSelectOption={handleSelectOption}
        onModalFinishedClosing={handleSortByModalClosed}
      />
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
              displayName
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
