import {
  Spacer,
  quoteLeft,
  quoteRight,
  Flex,
  useSpace,
  Text,
  Separator,
} from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { ArtistAutosuggestResultsQuery } from "__generated__/ArtistAutosuggestResultsQuery.graphql"
import { ArtistAutosuggestResults_results$data } from "__generated__/ArtistAutosuggestResults_results.graphql"
import { ErrorView } from "app/Components/ErrorView/ErrorView"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import {
  ProvidePlaceholderContext,
  PlaceholderBox,
  RandomWidthPlaceholderText,
} from "app/utils/placeholders"
import { times } from "lodash"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import usePrevious from "react-use/lib/usePrevious"
import { ArtistAutosuggestRow } from "./ArtistAutosuggestRow"

export type ArtistAutosuggestResult = NonNullable<
  NonNullable<
    NonNullable<NonNullable<ArtistAutosuggestResults_results$data["results"]>["edges"]>[0]
  >["node"]
>

const INITIAL_BATCH_SIZE = 32

const ArtistAutosuggestResultsFlatList: React.FC<{
  query: string
  results: ArtistAutosuggestResults_results$data | null
  onResultPress: (result: ArtistAutosuggestResult) => void
  relay: RelayPaginationProp
}> = ({ query, results: latestResults, onResultPress }) => {
  const [shouldShowLoadingPlaceholder, setShouldShowLoadingPlaceholder] = useState(true)
  const userHasStartedScrolling = useRef(false)

  useEffect(() => {
    if (query) {
      userHasStartedScrolling.current = false
    }
  }, [query])

  useEffect(() => {
    if (latestResults !== null) {
      setShouldShowLoadingPlaceholder(false)
    }
  }, [latestResults])

  const lastResults = usePrevious(latestResults)
  const flatListRef = useRef<FlatList<any>>(null)
  useEffect(() => {
    if (lastResults === null && latestResults !== null) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
    }
  }, [lastResults])

  const results = useRef(latestResults)
  results.current = latestResults || results.current

  const nodes: ArtistAutosuggestResult[] = useMemo(
    () =>
      results.current?.results?.edges?.map((e, i) => ({ ...e?.node!, key: e?.node?.href! + i })) ??
      [],
    [results.current]
  )

  const noResults = results.current && results.current.results?.edges?.length === 0

  if (shouldShowLoadingPlaceholder) {
    return (
      <ProvidePlaceholderContext>
        <ArtistAutosuggestResultsPlaceholder />
      </ProvidePlaceholderContext>
    )
  }

  if (noResults) {
    return (
      <AutoSuggestBoxContainer>
        <Spacer y={4} />
        <Text variant="sm-display" textAlign="center">
          Sorry, we couldn’t find anything for {quoteLeft}
          {query}.{quoteRight}
        </Text>
        <Text variant="sm-display" color="mono60" textAlign="center">
          Please try searching again with a different spelling.
        </Text>
      </AutoSuggestBoxContainer>
    )
  }

  return (
    <AutoSuggestBoxContainer>
      {nodes.map((node, index) => (
        <Flex key={index} mb={1}>
          <ArtistAutosuggestRow highlight={query} result={node} onResultPress={onResultPress} />
          <Separator mt={1} />
        </Flex>
      ))}
    </AutoSuggestBoxContainer>
  )
}

const AutoSuggestBoxContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const space = useSpace()
  return (
    <Flex
      style={{
        flex: 1,
        padding: space(2),
        borderStyle: "solid",
        borderColor: "#707070",
        borderWidth: 1,
        marginTop: 3,
        height: 175,
        overflow: "hidden",
      }}
    >
      {children}
    </Flex>
  )
}

const ArtistAutosuggestResultsContainer = createPaginationContainer(
  ArtistAutosuggestResultsFlatList,
  {
    results: graphql`
      fragment ArtistAutosuggestResults_results on Query
      @argumentDefinitions(
        query: { type: "String!" }
        count: { type: "Int!" }
        cursor: { type: "String" }
        entities: {
          type: "[SearchEntity]"
          defaultValue: [ARTIST, ARTWORK, FAIR, GENE, SALE, PROFILE, COLLECTION]
        }
      ) {
        results: searchConnection(
          query: $query
          mode: AUTOSUGGEST
          first: $count
          after: $cursor
          entities: $entities
        ) @connection(key: "ArtistAutosuggestResults_results") {
          edges {
            node {
              imageUrl
              href
              displayLabel
              __typename
              ... on SearchableItem {
                internalID
                displayType
                slug
              }
              ... on Artist {
                internalID
                formattedNationalityAndBirthday
                slug
                statuses {
                  artworks
                  auctionLots
                }
                targetSupply {
                  isP1
                  isTargetSupply
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
      return props.results?.results
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query ArtistAutosuggestResultsPaginationQuery(
        $query: String!
        $count: Int!
        $cursor: String
        $entities: [SearchEntity]
      ) @raw_response_type {
        ...ArtistAutosuggestResults_results
          @arguments(query: $query, count: $count, cursor: $cursor, entities: $entities)
      }
    `,
  }
)

export const ArtistAutosuggestResults: React.FC<{
  query: string
  onResultPress: (result: ArtistAutosuggestResult) => void
}> = React.memo(
  ({ query, onResultPress }) => {
    return (
      <QueryRenderer<ArtistAutosuggestResultsQuery>
        render={({ props, error }) => {
          if (error) {
            if (__DEV__) {
              console.error(error)
            } else {
              captureMessage(`ArtistAutosuggestResults ${error.message}`)
            }

            return (
              <ErrorView message="There seems to be a problem with the connection. Please try again shortly." />
            )
          }
          return (
            <ArtistAutosuggestResultsContainer
              query={query}
              results={props}
              onResultPress={onResultPress}
            />
          )
        }}
        variables={{
          query,
          count: INITIAL_BATCH_SIZE,
          entities: ["ARTIST"],
        }}
        query={graphql`
          query ArtistAutosuggestResultsQuery(
            $query: String!
            $count: Int!
            $entities: [SearchEntity]
          ) @raw_response_type {
            ...ArtistAutosuggestResults_results
              @arguments(query: $query, count: $count, entities: $entities)
          }
        `}
        environment={getRelayEnvironment()}
      />
    )
  },
  (a, b) => a.query === b.query
)

const TEXT_SIZE = 12
const IMAGE_SIZE = 35

const ArtistAutosuggestResultsPlaceholder: React.FC = () => {
  return (
    <Flex
      p={2}
      mb={1}
      mt={0.5}
      style={{
        flex: 1,
        borderStyle: "solid",
        borderColor: "#707070",
        borderWidth: 1,
      }}
    >
      {times(3).map((index) => (
        <Flex key={`autosuggest-result-${index}`} flexDirection="row" mb={2}>
          <PlaceholderBox width={IMAGE_SIZE} height={IMAGE_SIZE} />
          <Flex flex={1} ml={1} justifyContent="center">
            <RandomWidthPlaceholderText
              minWidth={100}
              maxWidth={150}
              height={TEXT_SIZE}
              marginBottom={0}
            />
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}
