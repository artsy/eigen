import { ShipsToSection_address } from "__generated__/ShipsToSection_address.graphql"
import { Box, Flex, Text } from "palette"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  address: ShipsToSection_address
}

export const ShipsToSection: React.FC<Props> = ({ address }) => {
  if (!address.requestedFulfillment) {
    return null
  }

  const agressInfo = address.requestedFulfillment
  return (
    <Flex>
      <View style={{ flexDirection: "column", justifyContent: "space-between", marginVertical: 14 }}>
        <Text data-test-id="addressLine1" color="black60" fontSize={15} fontWeight={400} lineHeight={22}>
          {agressInfo.addressLine1}
        </Text>
        <Box display="flex" flexDirection="row">
          <Text data-test-id="city" color="black60" fontSize={15} fontWeight={400} lineHeight={22} paddingRight={1}>
            {agressInfo.city}
          </Text>
          <Text data-test-id="region" color="black60" fontSize={15} fontWeight={400} lineHeight={22}>
            {agressInfo.region}
          </Text>
        </Box>
        <Text data-test-id="country" color="black60" fontSize={15} fontWeight={400} lineHeight={22}>
          {agressInfo.country}
        </Text>
        <Text data-test-id="phoneNumber" color="black60" fontSize={15} fontWeight={400} lineHeight={22}>
          {agressInfo.phoneNumber}
        </Text>
      </View>
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
          name
          phoneNumber
          postalCode
          region
        }
      }
    }
  `,
})
