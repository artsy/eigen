import { Box, Sans, Spacer } from "@artsy/palette"
import { PartnerOverview_partner } from "__generated__/PartnerOverview_partner.graphql"
import { ArtistListItemContainer as ArtistListItem } from "lib/Components/ArtistListItem"
import { ReadMore } from "lib/Components/ReadMore"
import { truncatedTextLimit } from "lib/Scenes/Artwork/hardware"
import { get } from "lib/utils/get"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import React, { useState } from "react"
import { ScrollView } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { PartnerLocationSectionContainer as PartnerLocationSection } from "./PartnerLocationSection"
import { PartnerOverviewWebsite } from "./PartnerOverviewWebsite"

const textLimit = truncatedTextLimit()
const PAGE_SIZE = 10

export const PartnerOverview: React.FC<{
  partner: PartnerOverview_partner
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [fetchingNextPage, setFetchingNextPage] = useState(false)
  const artists = partner.artists && partner.artists.edges

  const fetchNextPage = () => {
    if (fetchingNextPage || !partner.artists.pageInfo.endCursor) {
      return
    }
    setFetchingNextPage(true)
    relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("PartnerArtwork.tsx", error.message)
      }
      setFetchingNextPage(false)
    })
  }

  const renderArtists = () => {
    return artists.map(artist => {
      const node = artist.node
      if (!node) {
        return null
      }
      return (
        <Box key={node.id}>
          <ArtistListItem artist={node} />
          <Spacer mb={2} />
        </Box>
      )
    })
  }

  const aboutText = get(partner, p => p.profile.bio)
  return (
    <ScrollView onScroll={isCloseToBottom(fetchNextPage)}>
      <Box px={2} py={3}>
        {!!aboutText && (
          <>
            <Sans size="3t" weight="medium">
              About
            </Sans>
            <Spacer mb={2} />
            <ReadMore content={aboutText} maxChars={textLimit} />
            <Spacer mb={3} />
          </>
        )}
        <PartnerLocationSection partner={partner} />
        {!!partner.website && <PartnerOverviewWebsite website={partner.website} />}
        {!!artists && (
          <>
            <Sans size="3t" weight="medium">
              Artists
            </Sans>
            <Spacer mb={2} />
            {renderArtists()}
            <Spacer mb={3} />
          </>
        )}
      </Box>
    </ScrollView>
  )
}

export const PartnerOverviewFragmentContainer = createPaginationContainer(
  PartnerOverview,
  {
    partner: graphql`
      fragment PartnerOverview_partner on Partner
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        internalID
        website
        name
        locations {
          city
        }
        profile {
          bio
        }
        artists: artistsConnection(representedBy: true, sort: SORTABLE_ID_ASC, first: $count, after: $cursor)
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
            }
          }
        }

        ...PartnerLocationSection_partner
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.partner && props.partner.artists
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
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
