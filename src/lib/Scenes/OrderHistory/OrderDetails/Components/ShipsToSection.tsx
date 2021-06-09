import { ShipsToSection_address } from "__generated__/ShipsToSection_address.graphql"
import { Box, Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  address: ShipsToSection_address
}

export const ShipsToSection: React.FC<Props> = ({ address }) => {
  if (!address.requestedFulfillment) {
    return null
  }
  const agressInfo = address.requestedFulfillment
  const addedComma = agressInfo.city ? "," : ""

  return (
    <Flex style={{ flexDirection: "column", justifyContent: "space-between" }}>
      <Text testID="addressLine1" color="black60" variant="text">
        {agressInfo.addressLine1}
      </Text>

      <Box display="flex" flexDirection="row">
        <Text testID="city" color="black60" variant="text">
          {agressInfo.city + addedComma + " "}
        </Text>
        <Text testID="region" color="black60" variant="text">
          {agressInfo.region + " "}
        </Text>
        <Text testID="postalCode" color="black60" variant="text">
          {agressInfo.postalCode}
        </Text>
      </Box>
      <Text testID="country" color="black60" variant="text">
        {agressInfo.country}
      </Text>
      <Text testID="phoneNumber" color="black60" variant="text">
        {agressInfo.phoneNumber}
      </Text>
    </Flex>
  )
}

export const ShipsToSectionFragmentContainer = createFragmentContainer(ShipsToSection, {
  address: graphql`
    fragment ShipsToSection_address on CommerceOrder {
      requestedFulfillment {
        ... on CommerceShip {
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
