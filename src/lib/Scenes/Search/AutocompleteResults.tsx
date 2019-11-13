import { Flex, Serif } from "@artsy/palette"
import { AutocompleteResultsQuery } from "__generated__/AutocompleteResultsQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useEffect, useState } from "react"
import React from "react"
import Sentry from "react-native-sentry"
import { fetchQuery, graphql } from "react-relay"

type AutocompleteResult = AutocompleteResultsQuery["response"]["searchConnection"]["edges"][0]["node"]

async function fetchResults(query: string): Promise<AutocompleteResult[]> {
  try {
    const data = await fetchQuery<AutocompleteResultsQuery>(
      defaultEnvironment,
      graphql`
        query AutocompleteResultsQuery($query: String!) {
          searchConnection(query: $query, mode: AUTOSUGGEST, first: 5) {
            edges {
              node {
                imageUrl
                href
                displayLabel
              }
            }
          }
        }
      `,
      { query },
      { force: true }
    )
    if ("errors" in data) {
      // @ts-ignore
      throw new Error(data.errors.join("\n\n"))
    }

    return data.searchConnection.edges.map(e => e.node)
  } catch (e) {
    Sentry.captureMessage(e.message)
    console.error(e)
    return []
  }
}

export const AutocompleteResults: React.FC<{ query: string }> = ({ query }) => {
  const [results, setResults] = useState<AutocompleteResult[]>([])
  // const throttledFetchResults = useMemo(() => throttle(fetchResults, 800, { leading: false, trailing: true }), [])
  useEffect(
    () => {
      if (query.trim()) {
        fetchResults(query).then(setResults)
      }
    },
    [query]
  )
  return (
    <Flex>
      {results.map(({ displayLabel, href }) => (
        <Serif size="4" key={href}>
          {displayLabel}
        </Serif>
      ))}
    </Flex>
  )
}
