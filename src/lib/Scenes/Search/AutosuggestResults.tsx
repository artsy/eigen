import { Flex, Sans, Serif, Spacer } from "@artsy/palette"
import { AutosuggestResultsQuery } from "__generated__/AutosuggestResultsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { throttle } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react"
import React from "react"
import { TouchableOpacity } from "react-native"
import Sentry from "react-native-sentry"
import { fetchQuery, graphql } from "react-relay"

type AutosuggestResult = AutosuggestResultsQuery["response"]["searchConnection"]["edges"][0]["node"]

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
    if ("errors" in data) {
      // @ts-ignore
      throw new Error(data.errors.join("\n\n"))
    }

    return data.searchConnection.edges.map(e => e.node)
  } catch (e) {
    Sentry.captureMessage(e.stack)
    console.error(e)
    return []
  }
}

export const AutosuggestResults: React.FC<{ query: string }> = ({ query }) => {
  const [results, setResults] = useState<AutosuggestResult[]>([])
  const throttledFetchResults = useMemo(
    () => throttle(async (q: string) => setResults(await fetchResults(q)), 400, { leading: false, trailing: true }),
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
  const navRef = useRef<any>()
  return (
    <Flex ref={navRef}>
      {results.map(({ displayLabel, href, imageUrl, displayType }) => (
        <TouchableOpacity
          key={href}
          onPress={() => {
            SwitchBoard.presentNavigationViewController(navRef.current, href)
          }}
        >
          <Flex flexDirection="row" p={2} pb={0} alignItems="center">
            <OpaqueImageView imageURL={imageUrl} style={{ width: 36, height: 36 }} />
            <Spacer ml={1} />
            <Flex>
              <Serif size="3">{highlight(displayLabel, query)}</Serif>
              {displayType && (
                <Sans size="2" color="black60">
                  {displayType}
                </Sans>
              )}
            </Flex>
          </Flex>
        </TouchableOpacity>
      ))}
    </Flex>
  )
}

function highlight(displayLabel: string, query: string) {
  const i = displayLabel.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1) {
    return displayLabel
  }
  return (
    <>
      {displayLabel.slice(0, i)}
      <Serif size="3" weight="semibold">
        {displayLabel.slice(i, i + query.length)}
      </Serif>
      {displayLabel.slice(i + query.length)}
    </>
  )
}
