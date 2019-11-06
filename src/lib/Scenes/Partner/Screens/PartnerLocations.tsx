import { Box, Sans, Serif, Theme } from "@artsy/palette"
import { PartnerLocations_partner } from "__generated__/PartnerLocations_partner.graphql"
import { PartnerLocationsQuery } from "__generated__/PartnerLocationsQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { PartnerMapContainer as PartnerMap } from "../Components/PartnerMap"

const PartnerLocations: React.FC<{
  partner: PartnerLocations_partner
}> = ({ partner }) => {
  return (
    <Theme>
      <FlatList
        data={partner.locations}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <Box pt={60} px={2}>
            <Sans size="3t">{partner.locations.length > 1 ? "Locations" : "Location"}</Sans>
            <Serif size="5">{partner.name}</Serif>
          </Box>
        )}
        renderItem={({ item }) => <PartnerMap location={item} />}
      />
    </Theme>
  )
}

const PartnerLocationsContainer = createFragmentContainer(PartnerLocations, {
  partner: graphql`
    fragment PartnerLocations_partner on Partner {
      name
      locations {
        id
        ...PartnerMap_location
      }
    }
  `,
})

export const PartnerLocationsRenderer: React.SFC<{ partnerID: string }> = ({ partnerID }) => {
  return (
    <QueryRenderer<PartnerLocationsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query PartnerLocationsQuery($partnerID: String!) {
          partner(id: $partnerID) {
            ...PartnerLocations_partner
          }
        }
      `}
      variables={{ partnerID }}
      render={renderWithLoadProgress(PartnerLocationsContainer)}
    />
  )
}
