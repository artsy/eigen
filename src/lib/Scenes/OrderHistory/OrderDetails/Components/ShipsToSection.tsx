import { ShipsToSection_address } from "__generated__/ShipsToSection_address.graphql"
import { COUNTRY_SELECT_OPTIONS } from "lib/Components/CountrySelect"
import { Box, Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  address: ShipsToSection_address
}

export const ShipsToSection: React.FC<Props> = ({ address }) => {
  if (!address.requestedFulfillment || address.requestedFulfillment.__typename === "CommercePickup") {
    return null
  }
  if (address.requestedFulfillment.__typename === "CommerceShip") {
    const { city, addressLine1, addressLine2, region, postalCode, country, phoneNumber } = address.requestedFulfillment
    const addedComma = city ? "," : ""
    return (
      <Flex style={{ flexDirection: "column", justifyContent: "space-between" }}>
        <Text testID="addressLine1" color="black60" variant="text">
          {addressLine1}
        </Text>
        {!!addressLine2 && (
          <Text color="black60" variant="text">
            {addressLine2}
          </Text>
        )}

        <Box display="flex" flexDirection="row">
          <Text testID="city" color="black60" variant="text">
            {city + addedComma + " "}
          </Text>
          <Text testID="region" color="black60" variant="text">
            {region + " "}
          </Text>
          <Text testID="postalCode" color="black60" variant="text">
            {postalCode}
          </Text>
        </Box>
        <Text testID="country" color="black60" variant="text">
          {COUNTRY_SELECT_OPTIONS.find(({ value }) => value === country)!.label}
        </Text>
        <Text testID="phoneNumber" color="black60" variant="text">
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
        ... on CommercePickup {
          __typename
        }
      }
    }
  `,
})
