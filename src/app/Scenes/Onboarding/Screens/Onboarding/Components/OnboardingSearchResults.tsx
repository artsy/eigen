import { Flex, Join, Message, Spacer, quoteLeft, quoteRight } from "@artsy/palette-mobile"
import { ArtistListItemNew_artist$key } from "__generated__/ArtistListItemNew_artist.graphql"
import { OnboardingSearchResultsQuery } from "__generated__/OnboardingSearchResultsQuery.graphql"
import { OnboardingSearchResults_viewer$key } from "__generated__/OnboardingSearchResults_viewer.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { ArtistListItemNew } from "app/Components/ArtistListItemNew"
import { SCROLLVIEW_PADDING_BOTTOM_OFFSET } from "app/Components/constants"
import { ONBOARDING_AVATAR_SIZE as AVATAR_SIZE } from "app/Scenes/Onboarding/Screens/constants"
import { OnboardingFollowedArtist } from "app/store/OnboardingModel"
import { extractNodes } from "app/utils/extractNodes"
import { useOnboardingTracking } from "app/utils/hooks/useOnboardingTracking"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { times } from "lodash"
import { Suspense } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface OnboardingSearchResultsProps {
  term: string
  onArtistFollowed?: (
    artistRef: ArtistListItemNew_artist$key,
    artist: OnboardingFollowedArtist,
    slug: string
  ) => void
  onArtistUnfollowed?: (internalID: string) => void
}

const OnboardingSearchResults: React.FC<OnboardingSearchResultsProps> = ({
  term,
  onArtistFollowed,
  onArtistUnfollowed,
}) => {
  const { trackArtistFollow } = useOnboardingTracking()

  const queryData = useLazyLoadQuery<OnboardingSearchResultsQuery>(
    OnboardingSearchResultsScreenQuery,
    {
      term,
      imageSize: AVATAR_SIZE,
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
      keyboardShouldPersistTaps="handled"
      data={searchResults}
      contentContainerStyle={{
        paddingBottom: SCROLLVIEW_PADDING_BOTTOM_OFFSET,
      }}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      keyExtractor={(item, index) => (item.__typename === "Artist" ? item.internalID : `${index}`)}
      renderItem={({ item }) => {
        if (item.__typename !== "Artist") {
          return null
        }

        return (
          <ArtistListItemNew
            onFollow={() => {
              trackArtistFollow(false, item.internalID, item.slug)
              onArtistFollowed?.(
                item,
                {
                  internalID: item.internalID,
                  imageUrl: item.coverArtwork?.image?.cropped?.src ?? null,
                  blurhash: item.coverArtwork?.image?.blurhash ?? null,
                  initials: item.initials ?? null,
                },
                item.slug
              )
            }}
            onUnfollow={() => {
              trackArtistFollow(true, item.internalID, item.slug)
              onArtistUnfollowed?.(item.internalID)
            }}
            artist={item}
          />
        )
      }}
      ListEmptyComponent={
        <>
          <Spacer y={2} />
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
  term,
  onArtistFollowed,
  onArtistUnfollowed,
}) => {
  return (
    <Suspense fallback={<Placeholder />}>
      <OnboardingSearchResults
        term={term}
        onArtistFollowed={onArtistFollowed}
        onArtistUnfollowed={onArtistUnfollowed}
      />
    </Suspense>
  )
}

const OnboardingSearchResultsScreenQuery = graphql`
  query OnboardingSearchResultsQuery($term: String!, $imageSize: Int!) {
    viewer {
      ...OnboardingSearchResults_viewer @arguments(term: $term, imageSize: $imageSize)
    }
  }
`

const OnboardingSearchResultsFragment = graphql`
  fragment OnboardingSearchResults_viewer on Viewer
  @refetchable(queryName: "OnboardingSearchResults_viewerRefetch")
  @argumentDefinitions(
    term: { type: "String!" }
    count: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
    imageSize: { type: "Int!" }
  ) {
    matchConnection(
      term: $term
      entities: [ARTIST]
      first: $count
      after: $after
      mode: AUTOSUGGEST
    ) @connection(key: "OnboardingSearchResults_viewer_matchConnection") {
      edges {
        node {
          __typename
          ... on Artist {
            internalID
            slug
            isFollowed
            initials
            coverArtwork {
              image {
                url
                blurhash
                cropped(width: $imageSize, height: $imageSize) {
                  src
                }
              }
            }
            ...ArtistListItemNew_artist @arguments(imageSize: $imageSize)
          }
        }
      }
    }
  }
`

const Placeholder = () => (
  <ProvidePlaceholderContext>
    <Flex testID="OnboardingSearchResultsPlaceholder">
      <Join separator={<Spacer y={2} />}>
        {times(10).map((index: number) => (
          <Flex key={index}>
            <ArtistListItemPlaceholder />
          </Flex>
        ))}
      </Join>
    </Flex>
  </ProvidePlaceholderContext>
)
