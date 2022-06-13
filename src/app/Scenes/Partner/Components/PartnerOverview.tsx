import { PartnerOverview_partner$data } from "__generated__/PartnerOverview_partner.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { ReadMore } from "app/Components/ReadMore"
import Spinner from "app/Components/Spinner"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { TabEmptyState } from "app/Components/TabEmptyState"
import { extractNodes } from "app/utils/extractNodes"
import { Box, Flex, Sans, Spacer } from "palette"
import React, { useState } from "react"
import { Text } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { PartnerLocationSectionContainer as PartnerLocationSection } from "./PartnerLocationSection"

const PAGE_SIZE = 10

export const PartnerOverview: React.FC<{
  partner: PartnerOverview_partner$data
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [fetchingNextPage, setFetchingNextPage] = useState(false)
  const allArtists = extractNodes(partner.artists)

  const getArtistsWithPublishedArtworks = (artists: typeof allArtists) => {
    return artists.filter((artist) => artist?.counts?.artworks)
  }

  const filteredArtists = getArtistsWithPublishedArtworks(allArtists)

  const renderArtists = () => {
    return filteredArtists.map((artist) => {
      return (
        <Box key={artist.id}>
          <ArtistListItem artist={artist} />
          <Spacer mb={2} />
        </Box>
      )
    })
  }

  const aboutText = partner.profile?.bio

  if (!aboutText && !filteredArtists && !partner.cities) {
    return (
      <StickyTabPageScrollView>
        <TabEmptyState text="There is no information for this gallery yet" />
      </StickyTabPageScrollView>
    )
  }

  return (
    // TODO: Switch to StickyTabPageFlatList
    <StickyTabPageScrollView
      onEndReached={() => {
        if (fetchingNextPage || !partner.artists?.pageInfo.endCursor || !relay.hasMore()) {
          return
        }
        setFetchingNextPage(true)
        relay.loadMore(PAGE_SIZE, (error) => {
          if (error) {
            // FIXME: Handle error
            console.error("PartnerOverview.tsx", error.message)
          }
          setFetchingNextPage(false)
        })
      }}
    >
      <Spacer mb={2} />
      {!!aboutText && (
        <>
          <ReadMore content={aboutText} maxChars={300} textStyle="sans" />
          <Spacer mb={2} />
        </>
      )}
      <PartnerLocationSection partner={partner} />
      {!!filteredArtists && filteredArtists.length > 0 && (
        <>
          <Text>
            <Sans size="4t">Artists ({filteredArtists.length})</Sans>
          </Text>
          <Spacer mb={2} />
          {renderArtists()}
          {!!fetchingNextPage && (
            <Box p={2}>
              <Flex style={{ flex: 1 }} flexDirection="row" justifyContent="center">
                <Spinner />
              </Flex>
            </Box>
          )}
          <Spacer mb={3} />
        </>
      )}
    </StickyTabPageScrollView>
  )
}

export const PartnerOverviewFragmentContainer = createPaginationContainer(
  PartnerOverview,
  {
    partner: graphql`
      fragment PartnerOverview_partner on Partner
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        internalID
        name
        cities
        profile {
          bio
        }
        artists: artistsConnection(sort: SORTABLE_ID_ASC, first: $count, after: $cursor)
          @connection(key: "Partner_artists") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              ...ArtistListItem_artist
              counts {
                artworks
              }
            }
          }
        }

        ...PartnerLocationSection_partner
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.partner && props.partner.artists
    },
    getVariables(props, { count, cursor }) {
      return {
        id: props.partner.internalID,
        count,
        cursor,
      }
    },
    query: graphql`
      query PartnerOverviewInfiniteScrollQuery($id: String!, $cursor: String, $count: Int!) {
        partner(id: $id) {
          ...PartnerOverview_partner @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
