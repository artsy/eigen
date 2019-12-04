import { Flex } from "@artsy/palette"
import { AutosuggestResultsQuery } from "__generated__/AutosuggestResultsQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { throttle } from "lodash"
import { useEffect, useMemo, useState } from "react"
import React from "react"
import Sentry from "react-native-sentry"
import { fetchQuery, graphql } from "react-relay"
import { SearchResult } from "./SearchResult"
import { SearchResultList } from "./SearchResultList"

export type AutosuggestResult = AutosuggestResultsQuery["response"]["searchConnection"]["edges"][0]["node"]

async function fetchResults(query: string): Promise<AutosuggestResult[]> {
  try {
    const data = await fetchQuery<AutosuggestResultsQuery>(
      defaultEnvironment,
      graphql`
        query AutosuggestResultsQuery($query: String!) {
          searchConnection(query: $query, mode: AUTOSUGGEST, first: 5) {
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
      { query },
      { force: true }
    )

    return data.searchConnection.edges.map(e => e.node)
  } catch (e) {
    Sentry.captureMessage(e.stack)
    if (__DEV__ && typeof jest === "undefined") {
      console.error(e)
    }
    return []
  }
}

export const AutosuggestResults: React.FC<{ query: string }> = ({ query }) => {
  const [results, setResults] = useState<AutosuggestResult[]>([])
  const throttledFetchResults = useMemo(
    () =>
      throttle(
        async (q: string) => {
          const r = await fetchResults(q)
          setResults(r)
        },
        400,
        { leading: false, trailing: true }
      ),
    []
  )
  useEffect(
    () => {
      if (query) {
        throttledFetchResults(query)
      } else {
        setResults([])
      }
    },
    [query]
  )
  return (
    <Flex>
      <SearchResultList
        results={results.map(result => (
          <SearchResult highlight={query} result={result} />
        ))}
      />
    </Flex>
  )
}
