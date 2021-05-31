import { DateTime } from "luxon"
import { LocaleOptions } from "luxon"
import { Flex, Text } from "palette"
import React from "react"
import { View } from "react-native"

interface Props {
  fulfillment: "CommerceShip" | "CommercePickup" | "%other" | undefined
  code: string
  createdAt: string
}

export const OrderDetailsHeader: React.FC<Props> = ({ createdAt, fulfillment, code }) => {
  const isShip = fulfillment === "CommerceShip"
  const orderCreatedAt = DateTime.fromISO(createdAt)

  return (
    <Flex>
      <View style={{ flexDirection: "column", justifyContent: "space-between", marginVertical: 14 }}>
        <Flex flexDirection="row">
          <Text style={{ width: 112 }} mb={10} variant="text">
            Order Date
          </Text>

          <Text mb={10} data-test-id="date" color="black60" variant="text">
            {orderCreatedAt.toLocaleString(DateTime.DATE_SHORT as LocaleOptions)}
          </Text>
        </Flex>
        <Flex flexDirection="row">
          <Text style={{ width: 112 }} mb={10} variant="text">
            Order Number
          </Text>
          <Text data-test-id="code" mb={10} color="black60" variant="text">
            {code}
          </Text>
        </Flex>
        <Flex flexDirection="row">
          <Text style={{ width: 112 }} mb={10} variant="text">
            Status
          </Text>
          <Text mb={10} data-test-id="commerceShip" color="black60" variant="text">
            {isShip ? "Delivery" : "Pickup"}
          </Text>
        </Flex>
      </View>
    </Flex>
  )
}
