import { Button, Spacer, Text } from "@artsy/palette-mobile"
import { PartnerLocationSection_partner$data } from "__generated__/PartnerLocationSection_partner.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
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
      <RouterLink to={`/partner-locations/${partner.slug}`} hasChildTouchable>
        <Button variant="fillGray" size="large" block width="100%">
          See all location details
        </Button>
      </RouterLink>
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
