import { OnboardingSearchResults_viewer$key } from "__generated__/OnboardingSearchResults_viewer.graphql"
import { OnboardingSearchResultsQuery } from "__generated__/OnboardingSearchResultsQuery.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { times } from "lodash"
import { Flex, quoteLeft, quoteRight, Spacer, Text, useSpace } from "palette"
import { Suspense } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { ArtistListItemNew } from "./ArtistListItem"

interface OnboardingSearchResultsProps {
  entities: "ARTIST" | "PROFILE"
  term: string
}

const OnboardingSearchResults: React.FC<OnboardingSearchResultsProps> = ({ entities, term }) => {
  const space = useSpace()

  const queryData = useLazyLoadQuery<OnboardingSearchResultsQuery>(
    OnboardingSearchResultsScreenQuery,
    {
      term,
      entities: [entities],
    }
  )

  const { data } = usePaginationFragment<
    OnboardingSearchResultsQuery,
    OnboardingSearchResults_viewer$key
  >(OnboardingSearchResultsFragment, queryData.viewer)

  const searchResults = extractNodes(data?.matchConnection)

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={searchResults}
      contentContainerStyle={{
        paddingTop: space(1),
        paddingBottom: 80,
      }}
      keyExtractor={(item, index) => {
        switch (item.__typename) {
          case "Artist":
            return item.internalID
        }
        return item.__typename + index
      }}
      renderItem={({ item }) => {
        switch (item.__typename) {
          case "Artist":
            return <ArtistListItemNew artist={item} py={space(1)} />
          default:
            return null
        }
      }}
      ListEmptyComponent={
        <>
          <Spacer mt={3} />
          <Text variant="md">
            Sorry, we couldn’t find anything for {quoteLeft}
            {term}.{quoteRight}
          </Text>
          <Text variant="md" color="black60">
            Please try searching again with a different spelling.
          </Text>
        </>
      }
    />
  )
}

export const OnboardingSearchResultsScreen: React.FC<OnboardingSearchResultsProps> = ({
  entities,
  term,
}) => {
  return (
    <Suspense fallback={<Placeholder />}>
      <OnboardingSearchResults term={term} entities={entities} />
    </Suspense>
  )
}

const OnboardingSearchResultsScreenQuery = graphql`
  query OnboardingSearchResultsQuery($term: String!, $entities: [SearchEntity!]!) {
    viewer {
      ...OnboardingSearchResults_viewer @arguments(term: $term, entities: $entities)
    }
  }
`

const OnboardingSearchResultsFragment = graphql`
  fragment OnboardingSearchResults_viewer on Viewer
  @refetchable(queryName: "OnboardingSearchResults_viewerRefetch")
  @argumentDefinitions(
    term: { type: "String!" }
    entities: { type: "[SearchEntity!]!" }
    count: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
  ) {
    matchConnection(
      term: $term
      entities: $entities
      first: $count
      after: $after
      mode: AUTOSUGGEST
    ) @connection(key: "OnboardingSearchResults_viewer_matchConnection") {
      edges {
        node {
          __typename
          ... on Artist {
            internalID
            ...ArtistListItemNew_artist
          }
        }
      }
    }
  }
`

const Placeholder = () => (
  <ProvidePlaceholderContext>
    <Flex pt={1}>
      {times(10).map((index: number) => (
        <Flex py={1} key={index}>
          <ArtistListItemPlaceholder />
        </Flex>
      ))}
    </Flex>
  </ProvidePlaceholderContext>
)
