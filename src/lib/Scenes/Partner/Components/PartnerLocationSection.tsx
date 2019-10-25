import { Button, Flex, Sans, Spacer } from "@artsy/palette"
import { PartnerLocationSection_partner } from "__generated__/PartnerLocationSection_partner.graphql"
import { get } from "lib/utils/get"
import { union } from "lodash"
import React from "react"
import { Text } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

const PartnerLocationSection: React.FC<{
  partner: PartnerLocationSection_partner
}> = ({ partner }) => {
  const createLocationsString = locations => {
    const cities = []
    locations.forEach(location => {
      return cities.push(location.city)
    })
    const uniqCities = union(cities)
    const cityLength = uniqCities.length
    const lastUniqCity = uniqCities.pop()
    const joinedCities = uniqCities.join(",  ")
    const locationCountText = `${partner.name} has ${cityLength} locations in`
    return { locationText: locationCountText, cityText: joinedCities, lastCity: lastUniqCity }
  }

  const handleSeeAllLocations = () => {
    // FIXME:
  }

  const partnerLocations = get(partner, p => p.locations)
  const { locationText, cityText, lastCity } = createLocationsString(partnerLocations)
  const renderComponent = !!locationText && !!cityText && !!lastCity
  return (
    <>
      {!!renderComponent ? (
        <>
          <Flex flexDirection="row">
            <Text>
              <Sans size="2">{locationText} </Sans>
              <Sans weight="medium" size="2">
                {cityText}
              </Sans>
              <Sans size="2"> and </Sans>
              <Sans weight="medium" size="2">
                {lastCity}
              </Sans>
            </Text>
          </Flex>
          <Spacer mb={2} />
          <Button variant="secondaryGray" size="small" block width="100%" onPress={() => handleSeeAllLocations()}>
            See all location details
          </Button>
          <Spacer mb={3} />
        </>
      ) : null}
    </>
  )
}

export const PartnerLocationSectionContainer = createFragmentContainer(PartnerLocationSection, {
  partner: graphql`
    fragment PartnerLocationSection_partner on Partner {
      name
      locations {
        city
      }
    }
  `,
})
