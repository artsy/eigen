import { Flex, Serif, space } from "@artsy/palette"
import { AutosuggestResults_results } from "__generated__/AutosuggestResults_results.graphql"
import { AutosuggestResultsQuery } from "__generated__/AutosuggestResultsQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { useEffect, useMemo, useRef } from "react"
import React from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { SearchResult } from "./SearchResult"

export type AutosuggestResult = AutosuggestResults_results["results"]["edges"][0]["node"]

const AutosuggestResultsFlatList: React.FC<{
  query: string
  results: AutosuggestResults_results
  relay: RelayPaginationProp
}> = ({ query, results, relay }) => {
  const flatListRef = useRef<FlatList<any>>()
  useEffect(() => {
    if (query) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true })
    }
  }, [query])

  const nodes = useMemo(() => results?.results.edges.map(e => ({ ...e.node, key: e.node.href })), [results])

  return (
    <FlatList<AutosuggestResult>
      ref={flatListRef}
      style={{ flex: 1, padding: space(2) }}
      data={nodes}
      ListEmptyComponent={() => <Serif size="3">We couldn't find anything for “{query}”</Serif>}
      renderItem={({ item }) => {
        return (
          <Flex mb={2}>
            <SearchResult highlight={query} result={item} />
          </Flex>
        )
      }}
      onEndReached={() => {
        relay.loadMore(15)
      }}
    />
  )
}

const AutosuggestResultsContainer = createPaginationContainer(
  AutosuggestResultsFlatList,
  {
    results: graphql`
      fragment AutosuggestResults_results on Query
        @argumentDefinitions(
          query: { type: "String!" }
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: "" }
        ) {
        results: searchConnection(query: $query, mode: AUTOSUGGEST, first: $count, after: $cursor)
          @connection(key: "AutosuggestResults_results") {
          edges {
            node {
              imageUrl
              href
              displayLabel
              ... on SearchableItem {
                displayType
              }
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.results.results
    },
    getFragmentVariables(vars, totalCount) {
      return {
        ...vars,
        count: totalCount,
      }
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query AutosuggestResultsPaginationQuery($query: String!, $count: Int) {
        ...AutosuggestResults_results @arguments(query: $query, count: $count)
      }
    `,
  }
)

export const AutosuggestResults: React.FC<{ query: string }> = React.memo(
  ({ query }) => {
    return (
      <QueryRenderer<AutosuggestResultsQuery>
        render={renderWithLoadProgress(props => {
          return <AutosuggestResultsContainer query={query} results={props} />
        })}
        variables={{ query, count: 32 }}
        query={graphql`
          query AutosuggestResultsQuery($query: String!, $count: Int) {
            ...AutosuggestResults_results @arguments(query: $query, count: $count)
            me {
              id
            }
          }
        `}
        environment={defaultEnvironment}
      />
    )
  },
  (a, b) => a.query === b.query
)
