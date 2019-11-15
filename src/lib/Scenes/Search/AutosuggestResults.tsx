import { Flex, Sans, Serif, Spacer } from "@artsy/palette"
import { AutosuggestResultsQuery } from "__generated__/AutosuggestResultsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { throttle } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react"
import React from "react"
import { Animated, TouchableOpacity } from "react-native"
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
  const navRef = useRef<any>()
  return (
    <Flex ref={navRef}>
      {results.map(({ displayLabel, displayType, href, imageUrl }, i) => (
        <FadeIn key={href} delay={i * 40}>
          <AutosuggestResult
            title={highlight(displayLabel, query)}
            description={
              displayType && (
                <Sans size="2" color="black60">
                  {displayType}
                </Sans>
              )
            }
            imageURL={imageUrl}
            onPress={() => {
              SwitchBoard.presentNavigationViewController(navRef.current, href)
            }}
          />
        </FadeIn>
      ))}
    </Flex>
  )
}

export const AutosuggestResult: React.FC<{
  title: React.ReactChild
  description: React.ReactChild
  imageURL: string
  onPress(): void
}> = ({ title, onPress, description, imageURL }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Flex flexDirection="row" p={2} pb={0} alignItems="center">
        <OpaqueImageView imageURL={imageURL} style={{ width: 36, height: 36 }} />
        <Spacer ml={1} />
        <Flex>
          {title}
          {description}
        </Flex>
      </Flex>
    </TouchableOpacity>
  )
}

function highlight(displayLabel: string, query: string) {
  const i = displayLabel.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1) {
    return (
      <Serif size="3" weight="regular">
        {displayLabel}
      </Serif>
    )
  }
  return (
    <Serif size="3" weight="regular">
      {displayLabel.slice(0, i)}
      <Serif size="3" weight="semibold">
        {displayLabel.slice(i, i + query.length)}
      </Serif>
      {displayLabel.slice(i + query.length)}
    </Serif>
  )
}

const FadeIn: React.FC<{ delay: number }> = ({ delay, children }) => {
  const showing = useMemo(() => {
    return new Animated.Value(0)
  }, [])
  useEffect(() => {
    Animated.spring(showing, { toValue: 1, useNativeDriver: true, speed: 100, delay }).start()
  }, [])
  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: showing.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
        opacity: showing,
      }}
    >
      {children}
    </Animated.View>
  )
}
