import { Flex, Box, Text } from "@artsy/palette-mobile"
import { ShipsToSection_address$data } from "__generated__/ShipsToSection_address.graphql"
import { COUNTRY_SELECT_OPTIONS } from "app/Components/CountrySelect"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  address: ShipsToSection_address$data
}

export const ShipsToSection: React.FC<Props> = ({ address }) => {
  if (
    !address.requestedFulfillment ||
    address.requestedFulfillment.__typename === "CommercePickup"
  ) {
    return null
  }

  if (
    address.requestedFulfillment.__typename === "CommerceShip" ||
    address.requestedFulfillment.__typename === "CommerceShipArta"
  ) {
    const { city, addressLine1, addressLine2, region, postalCode, country, phoneNumber } =
      address.requestedFulfillment
    const addedComma = city ? "," : ""
    return (
      <Flex style={{ flexDirection: "column", justifyContent: "space-between" }}>
        <Text testID="addressLine1" color="mono60" variant="sm">
          {addressLine1}
        </Text>
        {!!addressLine2 && (
          <Text color="mono60" variant="sm">
            {addressLine2}
          </Text>
        )}

        <Box display="flex" flexDirection="row">
          <Text testID="city" color="mono60" variant="sm">
            {city + addedComma + " "}
          </Text>
          <Text testID="region" color="mono60" variant="sm">
            {region + " "}
          </Text>
          <Text testID="postalCode" color="mono60" variant="sm">
            {postalCode}
          </Text>
        </Box>
        <Text testID="country" color="mono60" variant="sm">
          {COUNTRY_SELECT_OPTIONS.find(({ value }) => value === country)?.label || country}
        </Text>
        <Text testID="phoneNumber" color="mono60" variant="sm">
          {phoneNumber}
        </Text>
      </Flex>
    )
  }
  return null
}

export const ShipsToSectionFragmentContainer = createFragmentContainer(ShipsToSection, {
  address: graphql`
    fragment ShipsToSection_address on CommerceOrder {
      requestedFulfillment {
        ... on CommercePickup {
          __typename
        }
        ... on CommerceShip {
          __typename
          addressLine1
          addressLine2
          city
          country
          phoneNumber
          postalCode
          region
        }
        ... on CommerceShipArta {
          __typename
          addressLine1
          addressLine2
          city
          country
          phoneNumber
          postalCode
          region
        }
      }
    }
  `,
})
