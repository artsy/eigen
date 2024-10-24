import {
  ActionType,
  BannerViewed,
  ContextModule,
  OwnerType,
  TappedChangePaymentMethod,
} from "@artsy/cohesion"
import { Banner, LinkText, Text } from "@artsy/palette-mobile"
import { useFocusEffect } from "@react-navigation/native"
import { PaymentFailureBanner_Query } from "__generated__/PaymentFailureBanner_Query.graphql"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useCallback } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

export const PaymentFailureBanner: React.FC = () => {
  const data = useLazyLoadQuery<PaymentFailureBanner_Query>(query, {})
  const failedPayments = extractNodes(data?.commerceMyOrders)
  const tracking = useTracking()

  const refetchData = useCallback(() => {
    console.warn("Query is refetching...")
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (failedPayments.length) {
        tracking.trackEvent(tracks.bannerViewed(failedPayments))
      }

      refetchData()
    }, [refetchData])
  )

  const handleBannerLinkClick = () => {
    tracking.trackEvent(tracks.tappedChangePaymentMethod(failedPayments))

    failedPayments.length === 1
      ? navigate(`orders/${failedPayments[0].internalID}/payment/new`)
      : navigate(`settings/purchases`)
  }

  if (failedPayments.length === 0) {
    return null
  }

  const bannerText =
    failedPayments.length === 1
      ? "Payment failed for your recent order.\n"
      : "Payment failed for your recent orders.\n"

  const linkText =
    failedPayments.length === 1 ? "Update payment method." : "Update payment method for each order."

  return (
    <Banner data-testid="payment-failure-banner" variant="error" dismissable>
      <Text style={{ alignSelf: "center" }} textAlign="left" variant="xs" color="white100">
        {bannerText}{" "}
        <LinkText
          textAlign="center"
          variant="xs"
          color="white100"
          onPress={() => handleBannerLinkClick()}
        >
          {linkText}
        </LinkText>
      </Text>
    </Banner>
  )
}

const query = graphql`
  query PaymentFailureBanner_Query {
    commerceMyOrders(first: 10, filters: [PAYMENT_FAILED]) {
      edges {
        node {
          code
          internalID
        }
      }
    }
  }
`

const tracks = {
  bannerViewed: (orders: any): BannerViewed => ({
    action: ActionType.bannerViewed,
    context_screen: OwnerType.home,
    context_module: ContextModule.paymentFailed,
    item_type: orders.length === 1 ? "order" : "orders",
    idem_id: orders.length === 1 ? orders[0].internalID : "",
  }),
  tappedChangePaymentMethod: (orders: any): TappedChangePaymentMethod => ({
    action: ActionType.tappedChangePaymentMethod,
    context_screen: OwnerType.home,
    context_module: ContextModule.paymentFailed,
    item_type: orders.length === 1 ? "order" : "orders",
    idem_id: orders.length === 1 ? orders[0].internalID : "",
  }),
}
