import {
  Flex,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { ArtAssistantArtistRailQuery } from "__generated__/ArtAssistantArtistRailQuery.graphql"
import {
  ARTIST_CARD_WIDTH,
  ArtistCardContainer,
  IMAGE_MAX_HEIGHT,
} from "app/Components/ArtistCard/ArtistCard"
import { CardRailFlatList } from "app/Components/CardRail/CardRailFlatList"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { graphql, useLazyLoadQuery } from "react-relay"

interface ArtAssistantArtistRailProps {
  /** `internalID`s from the answer's artists section, in the order it chose. */
  artistIDs: string[]
}

type Artist = ExtractNodeType<ArtAssistantArtistRailQuery["response"]["artistsConnection"]>

const ArtistRailLoading: React.FC = () => (
  <Skeleton>
    <Flex flexDirection="row" ml={2} testID="art-assistant-artist-rail-loading">
      <Join separator={<Spacer x={2} />}>
        {Array.from({ length: 2 }).map((_, index) => (
          <Flex key={index}>
            <SkeletonBox height={IMAGE_MAX_HEIGHT} width={ARTIST_CARD_WIDTH} />
            <Spacer y={1} />
            <SkeletonText>Artist name</SkeletonText>
          </Flex>
        ))}
      </Join>
    </Flex>
  </Skeleton>
)

const ArtistRailEmpty: React.FC = () => (
  <Text color="mono60" px={2} variant="xs" testID="art-assistant-artist-rail-empty">
    No matching artists found.
  </Text>
)

const ArtistRailError: React.FC = () => (
  <Text color="mono60" px={2} variant="xs" testID="art-assistant-artist-rail-error">
    Artist suggestions are unavailable.
  </Text>
)

export const ArtAssistantArtistRail: React.FC<ArtAssistantArtistRailProps> = ({ artistIDs }) => {
  if (artistIDs.length === 0) {
    return <ArtistRailEmpty />
  }

  return <ArtAssistantArtistRailQueryRenderer artistIDs={artistIDs} />
}

const ArtAssistantArtistRailQueryRenderer: React.FC<ArtAssistantArtistRailProps> = withSuspense({
  Component: ({ artistIDs }) => {
    const data = useLazyLoadQuery<ArtAssistantArtistRailQuery>(
      artistRailQuery,
      { artistIDs, first: artistIDs.length },
      { fetchPolicy: "store-or-network" }
    )
    const artists = extractNodes(data.artistsConnection).slice()
    const rankByID = new Map(artistIDs.map((id, index) => [id, index]))

    // Gravity's batch endpoint answers with a set, not a sequence, so the answer's own ordering
    // -- the only relevance signal the cards carry -- is restored here.
    artists.sort(
      (firstArtist, secondArtist) =>
        (rankByID.get(firstArtist.internalID) ?? Number.MAX_SAFE_INTEGER) -
        (rankByID.get(secondArtist.internalID) ?? Number.MAX_SAFE_INTEGER)
    )

    if (artists.length === 0) {
      return <ArtistRailEmpty />
    }

    return <ReadyArtistRail artists={artists} />
  },
  LoadingFallback: ArtistRailLoading,
  ErrorFallback: () => <ArtistRailError />,
})

const ReadyArtistRail: React.FC<{ artists: Artist[] }> = ({ artists }) => (
  <Flex testID="art-assistant-artist-rail">
    <CardRailFlatList<Artist>
      data={artists}
      keyExtractor={(artist) => artist.internalID}
      renderItem={({ item }) => <ArtistCardContainer artist={item} showDefaultFollowButton />}
    />
  </Flex>
)

const artistRailQuery = graphql`
  query ArtAssistantArtistRailQuery($artistIDs: [String], $first: Int!) {
    artistsConnection(ids: $artistIDs, first: $first) {
      edges {
        node {
          internalID
          ...ArtistCard_artist
        }
      }
    }
  }
`
