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
type RefreshHandler = (type?: RefreshType) => void

interface SavedSearchesListProps {
  me: SavedSearchesList_me$data
  relay: RelayPaginationProp
}

const SORT_OPTIONS: SortOption[] = [
  { value: "CREATED_AT_DESC", text: "Recently Added" },
  { value: "NAME_ASC", text: "Name (A-Z)" },
]

// tslint:disable-next-line:no-empty
const NOOP = () => {}

export const SavedSearchesList: React.FC<SavedSearchesListProps> = (props) => {
  const { me, relay } = props
  const [fetchingMore, setFetchingMore] = useState(false)
  const [refreshMode, setRefreshMode] = useState<RefreshType | null>(null)
  const { space } = useTheme()
  const refreshRef = useRef<RefreshHandler>(NOOP)

  const items = extractNodes(me.savedSearchesConnection)

  const loadMore = () => {
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

  const onRefresh = (type: RefreshType = "default") => {
    setRefreshMode(type)

    relay.refetchConnection(SAVED_SERCHES_PAGE_SIZE, (error) => {
      if (error) {
        console.error(error)
      }

      setRefreshMode(null)
    })
  }

  refreshRef.current = onRefresh

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
      onRefresh={onRefresh}
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
      onEndReached={loadMore}
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

export const SavedSearchesListWrapper: React.FC<SavedSearchesListProps> = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedSortValue, setSelectedSortValue] = useState("CREATED_AT_DESC")

  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const handleSelectOption = (option: SortOption) => {
    setSelectedSortValue(option.value)
    handleCloseModal()

    props.relay.refetchConnection(
      SAVED_SERCHES_PAGE_SIZE,
      (error) => {
        if (error) {
          console.error(error)
        }
      },
      {
        sort: option.value,
      }
    )
  }

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
        <SavedSearchesList {...props} />
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
