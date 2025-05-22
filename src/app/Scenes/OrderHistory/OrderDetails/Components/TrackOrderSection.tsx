import { Flex, Text, Button } from "@artsy/palette-mobile"
import { TrackOrderSection_section$data } from "__generated__/TrackOrderSection_section.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { getOrderStatus } from "app/utils/getOrderStatus"
import { getTrackingUrl } from "app/utils/getTrackingUrl"
import { DateTime } from "luxon"
import { Linking } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  section: TrackOrderSection_section$data
}

export const TrackOrderSection: React.FC<Props> = ({ section }) => {
  if (!section.lineItems) {
    return null
  }

  const [lineItem] = extractNodes(section?.lineItems)
  const { shipment, fulfillments } = lineItem || {}
  const [fulfillment] = extractNodes(fulfillments)
  const { estimatedDelivery, createdAt } = fulfillment || {}
  const trackingUrl = getTrackingUrl(lineItem)
  const orderStatus = getOrderStatus(section.displayState)
  const deliveredStatus = orderStatus === "delivered"

  return (
    <Flex flexDirection="row" justifyContent="space-between">
      <Flex>
        {!!orderStatus && (
          <Text testID="orderStatus" variant="sm" style={{ textTransform: "capitalize" }}>
            {orderStatus}
          </Text>
        )}
        {!!shipment?.trackingNumber && (
          <Text testID="trackingNumber" variant="sm" color="mono60">
            Tracking:&nbsp;
            <Text variant="sm" color="mono60" weight="medium">
              {shipment?.trackingNumber}
            </Text>
          </Text>
        )}

        {!!trackingUrl === false && (
          <Text testID="noTrackingNumber" variant="sm" color="mono60">
            Tracking not available
          </Text>
        )}

        {(!!shipment?.deliveryStart || !!createdAt) && (
          <Text testID="shippedOn" variant="sm" color="mono60">
            Shipped on&nbsp;
            <Text variant="sm" color="mono60" weight={!deliveredStatus ? "medium" : "regular"}>
              {DateTime.fromISO(shipment?.deliveryStart || createdAt).toLocaleString(
                DateTime.DATE_MED
              )}
            </Text>
          </Text>
        )}
        {!!deliveredStatus && !!shipment?.deliveryEnd && (
          <Text testID="deliveredStatus" variant="sm" color="mono60">
            {"Delivered on "}
            {DateTime.fromISO(shipment?.deliveryEnd).toLocaleString(DateTime.DATE_MED)}
          </Text>
        )}
        {!deliveredStatus && (
          <>
            {(!!shipment?.estimatedDeliveryWindow || !!estimatedDelivery) && (
              <Text testID="estimatedDelivery" variant="sm" color="mono60">
                Estimated Delivery:&nbsp;
                {!!estimatedDelivery ? (
                  <Text variant="sm" color="mono60" weight="medium">
                    {DateTime.fromISO(estimatedDelivery).toLocaleString(DateTime.DATE_MED)}
                  </Text>
                ) : (
                  <Text variant="sm" color="mono60" weight="medium">
                    {shipment?.estimatedDeliveryWindow}
                  </Text>
                )}
              </Text>
            )}
          </>
        )}
        {!!trackingUrl && (
          <Button
            testID="trackingUrl"
            mt={2}
            block
            variant="fillDark"
            onPress={() => Linking.openURL(trackingUrl)}
          >
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
      displayState
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
