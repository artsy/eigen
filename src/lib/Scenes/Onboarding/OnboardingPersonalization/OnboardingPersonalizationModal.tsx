import { useNavigation } from "@react-navigation/native"
import { captureMessage } from "@sentry/react-native"
import { OnboardingPersonalizationModal_artists } from "__generated__/OnboardingPersonalizationModal_artists.graphql"
import { OnboardingPersonalizationModalQuery } from "__generated__/OnboardingPersonalizationModalQuery.graphql"
import { SearchInput } from "lib/Components/SearchInput"
import { BackButton } from "lib/navigation/BackButton"
import { SearchContext, useSearchProviderValues } from "lib/Scenes/Search/SearchContext"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, space, Spinner } from "palette"
import React, { useEffect, useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { LoadFailureView } from "../../../Components/LoadFailureView"
import { defaultEnvironment } from "../../../relay/createEnvironment"
import { extractNodes } from "../../../utils/extractNodes"
import { OnboardingPersonalizationArtistListItem } from "./OnboardingPersonalizationArtistListItem"

interface OnboardingPersonalizationListProps {
  artists: OnboardingPersonalizationModal_artists
  relay: RelayPaginationProp
}

const OnboardingPersonalizationModal: React.FC<OnboardingPersonalizationListProps> = (props) => {
  const [query, setQuery] = useState("")
  const [fetchingMoreData, setFetchingMoreData] = useState(false)
  const searchProviderValues = useSearchProviderValues(query)

  const navigation = useNavigation()
  const artists = extractNodes(props.artists?.searchConnection)

  const loadMore = () => {
    console.log("loading more")
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

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <Flex
        style={{
          flex: 1,
          backgroundColor: "white",
          flexGrow: 1,
          paddingTop: useScreenDimensions().safeAreaInsets.top + 60,
        }}
      >
        <BackButton onPress={() => navigation.goBack()} showCloseIcon />

        <FlatList
          data={artists}
          ListHeaderComponent={
            <Flex px={2} mb={0.5} backgroundColor="white">
              <SearchInput
                ref={searchProviderValues.inputRef}
                placeholder="Search artists"
                value={query}
                onChangeText={(text) => {
                  setQuery(text)
                }}
                autoFocus
              />
            </Flex>
          }
          stickyHeaderIndices={[0]}
          renderItem={({ item: artist }) => (
            <OnboardingPersonalizationArtistListItem
              artist={artist}
              withFeedback
              relay={props.relay}
              containerStyle={{ paddingVertical: 10, paddingHorizontal: 20 }}
            />
          )}
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
    </SearchContext.Provider>
  )
}

const OnboardingPersonalizationModalPaginationContainer = createPaginationContainer(
  OnboardingPersonalizationModal,
  {
    artists: graphql`
      fragment OnboardingPersonalizationModal_artists on Query
      @argumentDefinitions(query: { type: "String!" }, count: { type: "Int!" }, cursor: { type: "String" }) {
        searchConnection(query: $query, mode: AUTOSUGGEST, first: $count, after: $cursor, entities: [ARTIST])
          @connection(key: "OnboardingPersonalizationModal__searchConnection") {
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
      query OnboardingPersonalizationModalPaginationQuery($query: String!, $count: Int!, $cursor: String)
      @raw_response_type {
        ...OnboardingPersonalizationModal_artists @arguments(query: $query, count: $count, cursor: $cursor)
      }
    `,
  }
)

export const OnboardingPersonalizationModalQueryRenderer = () => (
  <QueryRenderer<OnboardingPersonalizationModalQuery>
    // render={renderWithLoadProgress(OnboardingPersonalizationModalPaginationContainer)}
    render={({ props, error }) => {
      if (error) {
        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(error?.stack!)
        }
        return <LoadFailureView />
      }
      return <OnboardingPersonalizationModalPaginationContainer artists={props!} />
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
