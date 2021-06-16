import { ShipsToSection_address } from "__generated__/ShipsToSection_address.graphql"
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
    const addressInfo = address.requestedFulfillment
    const addedComma = addressInfo.city ? "," : ""
    return (
      <Flex style={{ flexDirection: "column", justifyContent: "space-between" }}>
        <Text testID="addressLine1" color="black60" variant="text">
          {addressInfo.addressLine1}
        </Text>
        {!!addressInfo.addressLine2 && (
          <Text color="black60" variant="text">
            {addressInfo.addressLine2}
          </Text>
        )}

        <Box display="flex" flexDirection="row">
          <Text testID="city" color="black60" variant="text">
            {addressInfo.city + addedComma + " "}
          </Text>
          <Text testID="region" color="black60" variant="text">
            {addressInfo.region + " "}
          </Text>
          <Text testID="postalCode" color="black60" variant="text">
            {addressInfo.postalCode}
          </Text>
        </Box>
        <Text testID="country" color="black60" variant="text">
          {addressInfo.country}
        </Text>
        <Text testID="phoneNumber" color="black60" variant="text">
          {addressInfo.phoneNumber}
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
