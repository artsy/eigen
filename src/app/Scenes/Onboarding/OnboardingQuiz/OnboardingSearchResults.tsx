import { Spacer } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { OnboardingSearchResultsQuery } from "__generated__/OnboardingSearchResultsQuery.graphql"
import { OnboardingSearchResults_viewer$key } from "__generated__/OnboardingSearchResults_viewer.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { times } from "lodash"
import { Flex, Join, Message, quoteLeft, quoteRight } from "palette"
import { Suspense } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { ArtistListItemNew } from "./Components/ArtistListItem"
import { PartnerListItem } from "./Components/PartnerListItem"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"
import { useOnboardingTracking } from "./Hooks/useOnboardingTracking"

interface OnboardingSearchResultsProps {
  entities: "ARTIST" | "PROFILE"
  term: string
}

const OnboardingSearchResults: React.FC<OnboardingSearchResultsProps> = ({ entities, term }) => {
  const { trackArtistFollow, trackGalleryFollow } = useOnboardingTracking()
  const { dispatch } = useOnboardingContext()
  const { getId } = useNavigation()

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
        paddingBottom: 80,
      }}
      ItemSeparatorComponent={() => <Spacer mt={2} />}
      keyExtractor={(item, index) => {
        switch (item.__typename) {
          case "Artist":
            return item.internalID
          case "Profile":
            return item.internalID
          default:
            return item.__typename + index
        }
      }}
      renderItem={({ item }) => {
        switch (item.__typename) {
          case "Artist":
            return (
              <ArtistListItemNew
                onFollow={() => {
                  trackArtistFollow(!!item.isFollowed, item.internalID, getId()!)
                  dispatch({ type: "FOLLOW", payload: item.internalID })
                }}
                artist={item}
              />
            )
          case "Profile": {
            const partner = item.owner

            if (!partner || partner.__typename !== "Partner") {
              return null
            }

            return (
              <PartnerListItem
                partner={partner}
                onFollow={() => {
                  trackGalleryFollow(!!item.isFollowed, item.internalID, getId()!)
                  dispatch({ type: "FOLLOW", payload: item.internalID })
                }}
              />
            )
          }
          default:
            return null
        }
      }}
      ListEmptyComponent={
        <>
          <Spacer mt={2} />
          <Message
            variant="default"
            title={`Sorry, we couldn’t find anything for ${quoteLeft}${term}.${quoteRight}`}
            titleStyle={{ variant: "md" }}
            text="Please try searching again with a different spelling."
            bodyTextStyle={{ variant: "md" }}
          />
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
            isFollowed
            ...ArtistListItemNew_artist
          }
          ... on Profile {
            internalID
            isFollowed
            owner {
              __typename
              ... on Partner {
                ...PartnerListItem_partner
              }
            }
          }
        }
      }
    }
  }
`

const Placeholder = () => (
  <ProvidePlaceholderContext>
    <Flex testID="OnboardingSearchResultsPlaceholder">
      <Join separator={<Spacer y={20} />}>
        {times(10).map((index: number) => (
          <Flex key={index}>
            <ArtistListItemPlaceholder />
          </Flex>
        ))}
      </Join>
    </Flex>
  </ProvidePlaceholderContext>
)
