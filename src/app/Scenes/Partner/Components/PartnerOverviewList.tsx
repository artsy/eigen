import { Flex, Spacer, Tabs, Text } from "@artsy/palette-mobile"
import { PartnerOverviewListArtistsQuery } from "__generated__/PartnerOverviewListArtistsQuery.graphql"
import { PartnerOverviewListArtists_partner$key } from "__generated__/PartnerOverviewListArtists_partner.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { ReadMore } from "app/Components/ReadMore"
import { PartnerLocationSection } from "app/Scenes/Partner/Components/PartnerLocationSection"
import { extractNodes } from "app/utils/extractNodes"
import { ON_END_REACHED_THRESHOLD_MASONRY } from "app/utils/masonryHelpers"
import { ActivityIndicator } from "react-native"
import { graphql, usePaginationFragment } from "react-relay"

const LOAD_BATCH_SIZE = 20

interface PartnerOverviewListProps {
  aboutText?: string | null
  displayArtistsSection?: boolean | null
  partner: PartnerOverviewListArtists_partner$key
}

type HeaderItem = { type: "header" }
type ArtistItem = { type: "artist"; id: string }
type ListItem = HeaderItem | ArtistItem

export const PartnerOverviewList: React.FC<PartnerOverviewListProps> = ({
  aboutText,
  displayArtistsSection,
  partner,
}) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    PartnerOverviewListArtistsQuery,
    PartnerOverviewListArtists_partner$key
  >(PartnerOverviewListArtistsFragment, partner)

  const artists = extractNodes(data.artistsConnection).map((artist) => ({
    ...artist,
    type: "artist",
  })) as ArtistItem[]

  const dataWithHeader: ListItem[] = [{ type: "header" }, ...artists]

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(LOAD_BATCH_SIZE)
  }

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "header") {
      return (
        <Flex pt={2}>
          {!!aboutText && (
            <>
              <ReadMore content={aboutText} maxChars={300} textVariant="sm" />
            </>
          )}
          <PartnerLocationSection partner={data as any} />
          {!!displayArtistsSection && (
            <>
              <Text variant="sm">Artists ({data.artistsConnection?.totalCount})</Text>
            </>
          )}
        </Flex>
      )
    }

    return <ArtistListItem artist={item} />
  }

  return (
    <Tabs.Masonry
      data={dataWithHeader}
      keyExtractor={(item: ListItem) => (item.type === "header" ? "header" : item.id)}
      estimatedItemSize={90}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      renderItem={renderItem}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
      ListFooterComponent={() => (
        <Flex
          alignItems="center"
          justifyContent="center"
          p={4}
          pb={6}
          style={{ opacity: isLoadingNext && hasNext ? 1 : 0 }}
        >
          <ActivityIndicator />
        </Flex>
      )}
    />
  )
}

export const PartnerOverviewListBaseFragment = graphql`
  fragment PartnerOverviewListBase_partner on Partner {
    cities
    displayArtistsSection
    profile {
      bio
    }
    name
    slug
    cities
    locations: locationsConnection(first: 0) {
      totalCount
    }
    ...PartnerLocationSection_partner
  }
`

const PartnerOverviewListArtistsFragment = graphql`
  fragment PartnerOverviewListArtists_partner on Partner
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" })
  @refetchable(queryName: "PartnerOverviewListArtistsQuery") {
    cities
    displayArtistsSection
    profile {
      bio
    }
    name
    slug
    cities
    locations: locationsConnection(first: 0) {
      totalCount
    }
    artistsConnection(
      first: $count
      after: $cursor
      displayOnPartnerProfile: true
      representedByOrHasPublishedArtworks: true
    ) @connection(key: "PartnerOverviewListArtists_artistsConnection") {
      totalCount
      edges {
        node {
          id
          ...ArtistListItem_artist
        }
      }
    }
  }
`
