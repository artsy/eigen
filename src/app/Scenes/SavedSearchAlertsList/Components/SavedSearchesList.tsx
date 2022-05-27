import { OwnerType } from "@artsy/cohesion"
import { SavedSearchesList_me$data } from "__generated__/SavedSearchesList_me.graphql"
import { SAVED_SERCHES_PAGE_SIZE } from "app/Components/constants"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { GoBackProps, navigate, navigationEvents } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { Flex, Spinner, useTheme } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { EmptyMessage } from "./EmptyMessage"
import { SavedSearchAlertsListPlaceholder } from "./SavedSearchAlertsListPlaceholder"
import { SavedSearchListItem } from "./SavedSearchListItem"
import { SortButton } from "./SortButton"
import { SortByModal, SortOption } from "./SortByModal"

type RefreshType = "default" | "delete"

interface RefreshOptions {
  type: RefreshType
  sort?: string
}

interface SavedSearchListWrapperProps {
  me: SavedSearchesList_me$data
  relay: RelayPaginationProp
}

interface SavedSearchesListProps extends SavedSearchListWrapperProps {
  refreshMode: RefreshType | null
  fetchingMore: boolean
  onRefresh: (options: RefreshOptions) => void
  onLoadMore: () => void
}

const SORT_OPTIONS: SortOption[] = [
  { value: "CREATED_AT_DESC", text: "Recently Added" },
  { value: "NAME_ASC", text: "Name (A-Z)" },
]

export const SavedSearchesList: React.FC<SavedSearchesListProps> = (props) => {
  const { me, fetchingMore, refreshMode, onRefresh, onLoadMore } = props
  const { space } = useTheme()
  const items = extractNodes(me.savedSearchesConnection)

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
        onRefresh({
          type: "default",
        })
      }}
      renderItem={({ item }) => {
        return (
          <SavedSearchListItem
            title={item.userAlertSettings.name!}
            onPress={() => {
              navigate(`my-profile/saved-search-alerts/${item.internalID}`)
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
  const [selectedSortValue, setSelectedSortValue] = useState("CREATED_AT_DESC")
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
        console.log(error.message)
      }
      setFetchingMore(false)
    })
  }

  const onRefresh = (options: RefreshOptions) => {
    setRefreshMode(options.type)

    relay.refetchConnection(
      SAVED_SERCHES_PAGE_SIZE,
      (error) => {
        if (error) {
          console.error(error)
        }

        setRefreshMode(null)
      },
      {
        sort: options.sort ?? selectedSortValue,
      }
    )
  }

  const refreshRef = useRef(onRefresh)
  refreshRef.current = onRefresh

  const handleSelectOption = (option: SortOption) => {
    if (selectedSortValue === option.value) {
      return
    }

    setSelectedSortValue(option.value)
    handleCloseModal()

    onRefresh({
      type: "delete",
      sort: option.value,
    })
  }

  useEffect(() => {
    const onDeleteRefresh = (backProps?: GoBackProps) => {
      if (backProps?.previousScreen === "EditSavedSearchAlert") {
        refreshRef.current({
          type: "delete",
        })
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
      <PageWithSimpleHeader
        title="Saved Alerts"
        right={<SortButton onPress={() => setModalVisible(true)} />}
      >
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
        />
      </PageWithSimpleHeader>
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
        sort: { type: "SavedSearchesSortEnum", defaultValue: CREATED_AT_DESC }
      ) {
        savedSearchesConnection(first: $count, after: $cursor, sort: $sort)
          @connection(key: "SavedSearches_savedSearchesConnection") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              internalID
              userAlertSettings {
                name
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
      return props.me.savedSearchesConnection
    },
    query: graphql`
      query SavedSearchesListQuery($count: Int!, $cursor: String, $sort: SavedSearchesSortEnum) {
        me {
          ...SavedSearchesList_me @arguments(count: $count, cursor: $cursor, sort: $sort)
        }
      }
    `,
  }
)
