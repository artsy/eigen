import { Box, Spacer, Text } from "@artsy/palette-mobile"
import { PartnerLocationsQuery } from "__generated__/PartnerLocationsQuery.graphql"
import { PartnerLocations_partner$data } from "__generated__/PartnerLocations_partner.graphql"
import { PartnerMapContainer as PartnerMap } from "app/Scenes/Partner/Components/PartnerMap"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { isCloseToBottom } from "app/utils/isCloseToBottom"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import React, { useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

const PAGE_SIZE = 4

const PartnerLocations: React.FC<{
  partner: PartnerLocations_partner$data
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [fetchingNextPage, setFetchingNextPage] = useState(false)

  const fetchNextPage = () => {
    if (fetchingNextPage) {
      return
    }
    setFetchingNextPage(true)
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("PartnerShows.tsx", error.message)
      }
      setFetchingNextPage(false)
    })
  }

  const locations = extractNodes(partner?.locations)

  return (
    <FlatList
      data={locations}
      onScroll={isCloseToBottom(fetchNextPage)}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => (
        <Box pt={6} px={2}>
          <Text variant="sm">{locations.length > 1 ? "Locations" : "Location"}</Text>
          <Text variant="sm-display">{partner.name}</Text>
        </Box>
      )}
      ListFooterComponent={() => <Spacer y={2} />}
      renderItem={({ item }) => <PartnerMap location={item} />}
    />
  )
}

export const PartnerLocationsContainer = createPaginationContainer(
  PartnerLocations,
  {
    partner: graphql`
      fragment PartnerLocations_partner on Partner
      @argumentDefinitions(count: { type: "Int", defaultValue: 4 }, cursor: { type: "String" }) {
        name
        internalID
        locations: locationsConnection(first: $count, after: $cursor)
          @connection(key: "Partner_locations") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              ...PartnerMap_location
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.partner && props.partner.locations
    },
    getVariables(props, { count, cursor }) {
      return {
        id: props.partner.internalID,
        count,
        cursor,
      }
    },
    query: graphql`
      query PartnerLocationsContainerQuery($id: String!, $cursor: String, $count: Int!) {
        partner(id: $id) {
          ...PartnerLocations_partner @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const PartnerLocationsQueryRenderer: React.FC<{ partnerID: string }> = ({ partnerID }) => {
  return (
    <QueryRenderer<PartnerLocationsQuery>
      environment={getRelayEnvironment()}
      query={PartnerLocationsScreenQuery}
      variables={{ partnerID }}
      render={renderWithLoadProgress(PartnerLocationsContainer)}
    />
  )
}

export const PartnerLocationsScreenQuery = graphql`
  query PartnerLocationsQuery($partnerID: String!) {
    partner(id: $partnerID) {
      ...PartnerLocations_partner
    }
  }
`
