import { Box, Text } from "@artsy/palette-mobile"
import { OrderDetailsFulfillment_order$key } from "__generated__/OrderDetailsFulfillment_order.graphql"
import { COUNTRY_SELECT_OPTIONS } from "app/Components/CountrySelect"
import { graphql, useFragment } from "react-relay"

interface OrderDetailsFulfillmentProps {
  order: OrderDetailsFulfillment_order$key
}

export const OrderDetailsFulfillment: React.FC<OrderDetailsFulfillmentProps> = ({ order }) => {
  const orderData = useFragment(fragment, order)

  if (!orderData) {
    return null
  }

  const { fulfillmentDetails, selectedFulfillmentOption, shippingOrigin } = orderData

  const isPickup = selectedFulfillmentOption?.type === "PICKUP"

  const isBlankFulfillmentDetails =
    !fulfillmentDetails ||
    Object.values(fulfillmentDetails).every(
      (part) => !part || (typeof part === "string" && part.trim() === "")
    )

  // Don't render if pickup has no origin or fulfillment has no details
  if ((isPickup && !shippingOrigin) || (!isPickup && isBlankFulfillmentDetails)) {
    return null
  }

  const renderFulfillmentContent = () => {
    if (isPickup) {
      return <Text variant="xs">{shippingOrigin}</Text>
    }

    if (!fulfillmentDetails) {
      return null
    }

    const { name, addressLine1, addressLine2, city, region, postalCode, country, phoneNumber } =
      fulfillmentDetails

    return (
      <Box>
        {!!name && <Text variant="xs">{name}</Text>}
        {!!addressLine1 && <Text variant="xs">{addressLine1}</Text>}
        {!!addressLine2 && <Text variant="xs">{addressLine2}</Text>}
        {!!(city || region || postalCode) && (
          <Text variant="xs">{[city, region, postalCode].filter(Boolean).join(", ")}</Text>
        )}
        {!!country && (
          <Text variant="xs">
            {COUNTRY_SELECT_OPTIONS.find(({ value }) => value === country)?.label || country}
          </Text>
        )}
        {!!phoneNumber?.display && <Text variant="xs">{phoneNumber.display}</Text>}
      </Box>
    )
  }

  return (
    <Box px={2}>
      <Text variant="sm" fontWeight="bold">
        {isPickup ? "Pickup" : "Ship to"}
      </Text>

      <Box mt={0.5}>{renderFulfillmentContent()}</Box>
    </Box>
  )
}

const fragment = graphql`
  fragment OrderDetailsFulfillment_order on Order {
    fulfillmentDetails {
      name
      addressLine1
      addressLine2
      city
      region
      postalCode
      country
      phoneNumber {
        display(format: INTERNATIONAL)
      }
    }
    selectedFulfillmentOption {
      type
    }
    shippingOrigin
  }
`
