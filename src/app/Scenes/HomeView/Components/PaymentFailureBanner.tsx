import { Banner, LinkText, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { PaymentFailureBannerQuery } from "__generated__/PaymentFailureBannerQuery.graphql"
import { PaymentFailureBannerRefetchQuery } from "__generated__/PaymentFailureBannerRefetchQuery.graphql"
import { PaymentFailureBanner_Fragment$key } from "__generated__/PaymentFailureBanner_Fragment.graphql"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useEffect } from "react"
import { graphql, useLazyLoadQuery, useRefetchableFragment } from "react-relay"

export const PaymentFailureBanner: React.FC = () => {
  const tracking = useHomeViewTracking()
  const isFocused = useIsFocused()

  const initialData = useLazyLoadQuery<PaymentFailureBannerQuery>(
    graphql`
      query PaymentFailureBannerQuery {
        ...PaymentFailureBanner_Fragment
      }
    `,
    {}
  )

  const [data, refetch] = useRefetchableFragment<
    PaymentFailureBannerRefetchQuery,
    PaymentFailureBanner_Fragment$key
  >(
    graphql`
      fragment PaymentFailureBanner_Fragment on Query
      @refetchable(queryName: "PaymentFailureBannerRefetchQuery") {
        commerceMyOrders(first: 10, filters: [PAYMENT_FAILED]) {
          edges {
            node {
              code
              internalID
            }
          }
        }
      }
    `,
    initialData
  )

  useEffect(() => {
    if (isFocused) {
      refetch({})
    }
  }, [isFocused])

  const failedPayments = extractNodes(data?.commerceMyOrders)

  const handleBannerLinkClick = () => {
    tracking.tappedChangePaymentMethod(failedPayments)

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
