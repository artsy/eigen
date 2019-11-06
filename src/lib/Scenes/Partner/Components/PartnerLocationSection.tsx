import { Button, Flex, Sans, Spacer } from "@artsy/palette"
import { PartnerLocationSection_partner } from "__generated__/PartnerLocationSection_partner.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { get } from "lib/utils/get"
import { union } from "lodash"
import React from "react"
import { Text } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  partner: PartnerLocationSection_partner
}

const createLocationsString = (locations, partner) => {
  const cities = []
  let lastUniqCity
  locations.forEach(location => {
    return cities.push(location.city)
  })
  const uniqCities = union(cities)
  const cityLength = uniqCities.length
  if (cityLength > 1) {
    lastUniqCity = uniqCities.pop()
  }
  const joinedCities = uniqCities.join(",  ")
  const locationCountText = `${partner.name} has ${cityLength} ${cityLength < 2 ? "location" : "locations"} in`
  return { locationText: locationCountText, cityText: joinedCities, lastCity: lastUniqCity }
}

class PartnerLocationSection extends React.Component<Props> {
  render() {
    const { partner } = this.props
    const handleSeeAllLocations = () => {
      SwitchBoard.presentNavigationViewController(this, `/partner-locations/${partner.slug}`)
    }
    const partnerLocations = get(partner, p => p.locations)
    const { locationText, cityText, lastCity } = createLocationsString(partnerLocations, partner)
    const renderComponent = !!locationText && !!cityText

    return (
      <>
        {!!renderComponent && (
          <>
            <Flex flexDirection="row">
              <Text>
                <Sans size="2">{locationText} </Sans>
                <Sans weight="medium" size="2">
                  {cityText}
                </Sans>
                {lastCity && (
                  <>
                    <Sans size="2"> and </Sans>
                    <Sans weight="medium" size="2">
                      {lastCity}
                    </Sans>
                  </>
                )}
              </Text>
            </Flex>
            <Spacer mb={2} />
            <Button variant="secondaryGray" size="small" block width="100%" onPress={() => handleSeeAllLocations()}>
              See all location details
            </Button>
            <Spacer mb={3} />
          </>
        )}
      </>
    )
  }
}

export const PartnerLocationSectionContainer = createFragmentContainer(PartnerLocationSection, {
  partner: graphql`
    fragment PartnerLocationSection_partner on Partner {
      slug
      name
      locations {
        city
      }
    }
  `,
})
