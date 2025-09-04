import { Flex, Spacer, Tabs, Text } from "@artsy/palette-mobile"
import { ListRenderItem } from "@shopify/flash-list"
import { PartnerOverviewListArtistsQuery } from "__generated__/PartnerOverviewListArtistsQuery.graphql"
import {
  PartnerOverviewListArtists_partner$key,
  PartnerOverviewListArtists_partner$data,
} from "__generated__/PartnerOverviewListArtists_partner.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { ReadMore } from "app/Components/ReadMore"
import { PartnerLocationSection } from "app/Scenes/Partner/Components/PartnerLocationSection"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { useCallback } from "react"
import { ActivityIndicator } from "react-native"
import { graphql, usePaginationFragment } from "react-relay"

type ArtistType = ExtractNodeType<PartnerOverviewListArtists_partner$data["artistsConnection"]>

interface PartnerOverviewListProps {
  aboutText?: string | null
  displayArtistsSection?: boolean | null
  partner: PartnerOverviewListArtists_partner$key
}

export const PartnerOverviewList: React.FC<PartnerOverviewListProps> = ({
  aboutText,
  displayArtistsSection,
  partner,
}) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    PartnerOverviewListArtistsQuery,
    PartnerOverviewListArtists_partner$key
  >(PartnerOverviewListArtistsFragment, partner)

  const artists = extractNodes(data.artistsConnection)

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(20)
  }

  const renderItem: ListRenderItem<ArtistType> = useCallback(
    ({ item }) => (
      <Flex py={1}>
        <ArtistListItem artist={item} />
      </Flex>
    ),
    [handleLoadMore]
  )

  const keyExtractor = useCallback((item: ArtistType, i: number) => `${i}-${item.id}`, [])

  return (
    <Tabs.FlashList
      estimatedItemSize={85}
      data={artists}
      keyExtractor={keyExtractor}
      ListHeaderComponent={() => {
        return (
          <>
            <Spacer y={2} />
            {!!aboutText && (
              <>
                <ReadMore content={aboutText} maxChars={300} textVariant="sm" />
              </>
            )}
            <PartnerLocationSection partner={data as any} />
            {!!displayArtistsSection && (
              <>
                <Text variant="sm">Artists ({data.artistsConnection?.totalCount})</Text>
                <Spacer y={2} />
              </>
            )}
          </>
        )
      }}
      renderItem={renderItem}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.3}
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
