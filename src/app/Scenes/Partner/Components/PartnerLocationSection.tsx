import { Spacer, Text, Button } from "@artsy/palette-mobile"
import { PartnerLocationSection_partner$data } from "__generated__/PartnerLocationSection_partner.graphql"
import { navigate } from "app/system/navigation/navigate"
import { get } from "app/utils/get"
import { createFragmentContainer, graphql } from "react-relay"

interface PartnerLocationSectionProps {
  partner: PartnerLocationSection_partner$data
}

export const createLocationsString = (partner: PartnerLocationSection_partner$data) => {
  const locationsCount = partner.locations?.totalCount ?? 0

  let lastUniqCity
  const uniqCities = (partner.cities || []).slice(0)
  const cityLength = uniqCities.length
  if (cityLength > 1) {
    lastUniqCity = uniqCities.pop()
  }

  const joinedCities = uniqCities.join(", ")

  const locationCountText = `${partner.name} has ${locationsCount} ${
    locationsCount < 2 ? "location" : "locations"
  } in`

  return { locationText: locationCountText, cityText: joinedCities, lastCity: lastUniqCity }
}

export const PartnerLocationSection: React.FC<PartnerLocationSectionProps> = ({ partner }) => {
  const handleSeeAllLocations = () => {
    navigate(`/partner-locations/${partner.slug}`)
  }

  const cities = get(partner, (p) => p.cities)

  if (!cities) {
    return null
  }

  const { locationText, cityText, lastCity } = createLocationsString(partner)

  if (!locationText || !cityText) {
    return null
  }

  return (
    <>
      <Text variant="sm">
        {locationText}{" "}
        <Text variant="sm" weight="medium">
          {cityText}
        </Text>
        {!!lastCity && (
          <>
            {" and "}
            <Text variant="sm" weight="medium">
              {lastCity}
            </Text>
          </>
        )}
        .
      </Text>
      <Spacer y={2} />
      <Button
        variant="fillGray"
        size="large"
        block
        width="100%"
        onPress={() => handleSeeAllLocations()}
      >
        See all location details
      </Button>
      <Spacer y={4} />
    </>
  )
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
