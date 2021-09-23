import { TrackOrderSection_section } from "__generated__/TrackOrderSection_section.graphql"
import { extractNodes } from "lib/utils/extractNodes"
import { getOrderStatus, OrderState } from "lib/utils/getOrderStatus"
import { getTrackingUrl } from "lib/utils/getTrackingUrl"
import { DateTime } from "luxon"
import { Button, Flex, Text, TextV3 } from "palette"
import React, { FC } from "react"
import { Linking } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  section: TrackOrderSection_section
}

export const TrackOrderSection: FC<Props> = ({ section }) => {
  if (!section.lineItems) {
    return null
  }

  const [lineItem] = extractNodes(section?.lineItems)
  const { shipment, fulfillments } = lineItem || {}
  const [fulfillment] = extractNodes(fulfillments)
  const { estimatedDelivery, createdAt } = fulfillment || {}
  const trackingUrl = getTrackingUrl(lineItem)
  const orderStatus = getOrderStatus(section.state as OrderState, lineItem)
  const deliveredStatus = orderStatus === "delivered"

  return (
    <Flex flexDirection="row" justifyContent="space-between">
      <Flex>
        <Text testID="orderStatus" variant="text" style={{ textTransform: "capitalize" }}>
          {orderStatus}
        </Text>
        {!!shipment?.trackingNumber ? (
          <Text testID="trackingNumber" variant="text" color="black60">
            Tracking:&nbsp;
            <TextV3 variant="sm" color="black60" weight="medium">
              {shipment?.trackingNumber}
            </TextV3>
          </Text>
        ) : (
          <Text testID="noTrackingNumber" variant="text" color="black60">
            Tracking not available
          </Text>
        )}
        {(!!shipment?.deliveryStart || !!createdAt) && (
          <Text testID="shippedOn" variant="text" color="black60">
            Shipped on&nbsp;
            <TextV3 variant="sm" color="black60" weight={!deliveredStatus ? "medium" : "regular"}>
              {DateTime.fromISO(shipment?.deliveryStart || createdAt).toLocaleString(DateTime.DATE_MED)}
            </TextV3>
          </Text>
        )}
        {!!deliveredStatus && !!shipment?.deliveryEnd && (
          <Text testID="deliveredStatus" variant="text" color="black60">
            {"Delivered on "}
            {DateTime.fromISO(shipment?.deliveryEnd).toLocaleString(DateTime.DATE_MED)}
          </Text>
        )}
        {!deliveredStatus && (
          <>
            {(!!shipment?.estimatedDeliveryWindow || !!estimatedDelivery) && (
              <Text testID="estimatedDelivery" variant="text" color="black60">
                Estimated Delivery:&nbsp;
                {!!estimatedDelivery ? (
                  <TextV3 variant="sm" color="black60" weight="medium">
                    {DateTime.fromISO(estimatedDelivery).toLocaleString(DateTime.DATE_MED)}
                  </TextV3>
                ) : (
                  <TextV3 variant="sm" color="black60" weight="medium">
                    {shipment?.estimatedDeliveryWindow}
                  </TextV3>
                )}
              </Text>
            )}
          </>
        )}
        {!!trackingUrl && (
          <Button testID="trackingUrl" mt={2} block variant="primaryBlack" onPress={() => Linking.openURL(trackingUrl)}>
            View full tracking details
          </Button>
        )}
      </Flex>
    </Flex>
  )
}

export const TrackOrderSectionFragmentContainer = createFragmentContainer(TrackOrderSection, {
  section: graphql`
    fragment TrackOrderSection_section on CommerceOrder {
      state
      lineItems(first: 1) {
        edges {
          node {
            shipment {
              status
              trackingUrl
              trackingNumber
              deliveryStart
              deliveryEnd
              estimatedDeliveryWindow
            }
            fulfillments(first: 1) {
              edges {
                node {
                  createdAt
                  trackingId
                  estimatedDelivery
                }
              }
            }
          }
        }
      }
    }
  `,
})
