import { PartnerLocationSection_partner$data } from "__generated__/PartnerLocationSection_partner.graphql"
import { navigate } from "app/navigation/navigate"
import { get } from "app/utils/get"
import { Button, Sans, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  partner: PartnerLocationSection_partner$data
}

const createLocationsString = (partner: PartnerLocationSection_partner$data) => {
  const locationsCount = partner.locations?.totalCount
  let lastUniqCity
  const uniqCities = (partner.cities || []).slice(0)
  const cityLength = uniqCities.length
  if (cityLength > 1) {
    lastUniqCity = uniqCities.pop()
  }
  const joinedCities = uniqCities.join(", ")
  const locationCountText = `${partner.name} has ${locationsCount} ${
    cityLength < 2 ? "location" : "locations"
  } in`
  return { locationText: locationCountText, cityText: joinedCities, lastCity: lastUniqCity }
}

class PartnerLocationSection extends React.Component<Props> {
  render() {
    const { partner } = this.props
    const handleSeeAllLocations = () => {
      navigate(`/partner-locations/${partner.slug}`)
    }
    const cities = get(partner, (p) => p.cities)
    if (!cities) {
      return null
    }
    const { locationText, cityText, lastCity } = createLocationsString(partner)
    const renderComponent = !!locationText && !!cityText

    return (
      !!renderComponent && (
        <>
          <Sans size="3t">
            {locationText}{" "}
            <Sans weight="medium" size="3t">
              {cityText}
            </Sans>
            {!!lastCity && (
              <>
                {" and "}
                <Sans weight="medium" size="3t">
                  {lastCity}
                </Sans>
              </>
            )}
            .
          </Sans>
          <Spacer mb={2} />
          <Button
            variant="fillGray"
            size="large"
            block
            width="100%"
            onPress={() => handleSeeAllLocations()}
          >
            See all location details
          </Button>
          <Spacer mb={3} />
        </>
      )
    )
  }
}

export const PartnerLocationSectionContainer = createFragmentContainer(PartnerLocationSection, {
  partner: graphql`
    fragment PartnerLocationSection_partner on Partner {
      slug
      name
      cities
      locations: locationsConnection(first: 0) {
        totalCount
      }
    }
  `,
})
