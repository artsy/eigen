import { StackScreenProps } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { OnboardingPersonalizationModal_artists$data } from "__generated__/OnboardingPersonalizationModal_artists.graphql"
import { OnboardingPersonalizationModalQuery } from "__generated__/OnboardingPersonalizationModalQuery.graphql"
import { SearchInput } from "app/Components/SearchInput"
import { BackButton } from "app/navigation/BackButton"
import { isEqual } from "lodash"
import { Flex, Spinner, Text, useSpace } from "palette"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import usePrevious from "react-use/lib/usePrevious"
import { useScreenDimensions } from "shared/hooks"
import { LoadFailureView } from "../../../Components/LoadFailureView"
import { defaultEnvironment } from "../../../relay/createEnvironment"
import { extractNodes } from "../../../utils/extractNodes"
import { OnboardingPersonalizationNavigationStack } from "./OnboardingPersonalization"
import { OnboardingPersonalizationArtistListItem } from "./OnboardingPersonalizationArtistListItem"

interface OnboardingPersonalizationModalNavigationProps
  extends StackScreenProps<
    OnboardingPersonalizationNavigationStack,
    "OnboardingPersonalizationModal"
  > {}

interface OnboardingPersonalizationListProps extends OnboardingPersonalizationModalNavigationProps {
  artists: OnboardingPersonalizationModal_artists$data
  relay: RelayPaginationProp
}

const OnboardingPersonalizationModal: React.FC<OnboardingPersonalizationListProps> = (props) => {
  const space = useSpace()
  const [query, setQuery] = useState("")
  const flatListRef = useRef<FlatList<any>>(null)
  const [fetchingMoreData, setFetchingMoreData] = useState(false)

  const artists = extractNodes(props.artists?.searchConnection)

  const loadMore = () => {
    if (!props.relay.hasMore() || props.relay.isLoading()) {
      return
    }

    setFetchingMoreData(true)
    props.relay.loadMore(20, (error) => {
      if (error) {
        console.log(error)
      }
      setFetchingMoreData(false)
    })
  }

  useEffect(() => {
    props.relay.refetchConnection(
      20,
      (error) => {
        if (error) {
          throw new Error("Search failed:" + error.message)
        }
      },
      {
        query,
      }
    )
  }, [query])

  // When the user has scrolled down some and then starts typing again we want to
  // take them back to the top of the results list. But if we do that immediately
  // after the query changed then janky behaviour ensues, so we need to wait for
  // the relevant results to be fetched and rendered. We know new results come
  // in when the previous results we encountered were `[]` (when the query changed but
  // the fetch/cache-lookup has not completed yet) so we can scroll the user back to
  // the top whenever that happens.
  const lastArtists = usePrevious(artists)
  useEffect(() => {
    if (isEqual(lastArtists, []) && !isEqual(artists, [])) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
    }
  }, [lastArtists])

  // Using props.relay.isLoading() causes jest to fail as it is always return true.
  // We had instead to assign it to a boolean to avoid that
  // See: https://github.com/facebook/relay/issues/1973
  const isLoading = !__TEST__
    ? props.relay.isLoading()
    : useMemo(() => props.relay.isLoading(), [props.relay])

  return (
    <Flex
      style={{
        flex: 1,
        backgroundColor: "white",
        flexGrow: 1,
        paddingTop: useScreenDimensions().safeAreaInsets.top + 60,
      }}
    >
      <BackButton onPress={() => props.navigation.goBack()} showCloseIcon />

      <FlatList
        ref={flatListRef}
        data={artists}
        ListHeaderComponent={
          <Flex px={2} mb={1} backgroundColor="white">
            <SearchInput
              placeholder="Search artists"
              value={query}
              testID="searchInput"
              onChangeText={(text) => {
                setQuery(text)
              }}
              autoFocus
            />
          </Flex>
        }
        stickyHeaderIndices={[0]}
        initialNumToRender={12}
        renderItem={({ item: artist }) => (
          <OnboardingPersonalizationArtistListItem
            artist={artist}
            withFeedback
            relay={props.relay}
            containerStyle={{ paddingVertical: 10, paddingHorizontal: 20 }}
            disableNavigation
          />
        )}
        ListEmptyComponent={
          query.length > 2 && !isLoading
            ? () => {
                return (
                  <Flex px={2} testID="noResults">
                    <Text variant="sm">We couldn't find anything for “{query}”</Text>
                  </Flex>
                )
              }
            : null
        }
        keyExtractor={(artist) => artist.id!}
        contentContainerStyle={{ paddingVertical: space(2) }}
        onEndReached={loadMore}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          fetchingMoreData ? (
            <Flex alignItems="center" justifyContent="center" py={1}>
              <Spinner />
            </Flex>
          ) : null
        }
      />
    </Flex>
  )
}

export const OnboardingPersonalizationModalPaginationContainer = createPaginationContainer(
  OnboardingPersonalizationModal,
  {
    artists: graphql`
      fragment OnboardingPersonalizationModal_artists on Query
      @argumentDefinitions(
        query: { type: "String!" }
        count: { type: "Int!" }
        cursor: { type: "String" }
      ) {
        searchConnection(
          query: $query
          mode: AUTOSUGGEST
          first: $count
          after: $cursor
          entities: [ARTIST]
        ) @connection(key: "OnboardingPersonalizationModal__searchConnection") {
          edges {
            node {
              imageUrl
              href
              displayLabel
              ... on Artist {
                id
                internalID
                slug
                name
                initials
                href
                is_followed: isFollowed
                nationality
                birthday
                deathday
                image {
                  url
                }
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.artists?.searchConnection
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query OnboardingPersonalizationModalPaginationQuery(
        $query: String!
        $count: Int!
        $cursor: String
      ) @raw_response_type {
        ...OnboardingPersonalizationModal_artists
          @arguments(query: $query, count: $count, cursor: $cursor)
      }
    `,
  }
)

export const OnboardingPersonalizationModalQueryRenderer: React.FC<
  OnboardingPersonalizationModalNavigationProps
> = (initialProps) => (
  <QueryRenderer<OnboardingPersonalizationModalQuery>
    render={({ props, error }) => {
      if (error) {
        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(error?.stack!)
        }
        return <LoadFailureView />
      }
      return (
        <OnboardingPersonalizationModalPaginationContainer artists={props!} {...initialProps} />
      )
    }}
    cacheConfig={{ force: true }}
    variables={{
      query: "",
      count: 20,
    }}
    query={graphql`
      query OnboardingPersonalizationModalQuery($query: String!, $count: Int!) @raw_response_type {
        ...OnboardingPersonalizationModal_artists @arguments(query: $query, count: $count)
      }
    `}
    environment={defaultEnvironment}
  />
)
