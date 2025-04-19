import { Banner, LinkText, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { PaymentFailureBannerQuery } from "__generated__/PaymentFailureBannerQuery.graphql"
import { PaymentFailureBannerRefetchQuery } from "__generated__/PaymentFailureBannerRefetchQuery.graphql"
import { PaymentFailureBanner_Fragment$key } from "__generated__/PaymentFailureBanner_Fragment.graphql"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useCallback, useEffect } from "react"
import { graphql, useLazyLoadQuery, useRefetchableFragment } from "react-relay"

export const PaymentFailureBanner: React.FC = withSuspense({
  Component: () => {
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
        refetch(
          {},
          {
            fetchPolicy: "store-and-network",
          }
        )
      }
    }, [isFocused])

    const failedPayments = extractNodes(data?.commerceMyOrders)

    useEffect(() => {
      if (failedPayments.length > 0) {
        tracking.bannerViewed(failedPayments)
      }
    }, [failedPayments, tracking])

    const handleBannerLinkClick = useCallback(() => {
      tracking.tappedChangePaymentMethod(failedPayments)

      const route =
        failedPayments.length === 1
          ? `orders/${failedPayments[0].internalID}/payment/new`
          : `orders`

      navigate(route)
    }, [failedPayments, tracking])

    if (failedPayments.length === 0) {
      return null
    }

    const bannerText =
      failedPayments.length === 1
        ? "Payment failed for your recent order."
        : "Payment failed for your recent orders."

    const linkText =
      failedPayments.length === 1
        ? "Update payment method."
        : "Update payment method for each order."

    return (
      <Banner data-testid="PaymentFailureBanner" variant="error" dismissable>
        <Text textAlign="left" variant="xs" color="mono0">
          {bannerText}
        </Text>
        <LinkText
          variant="xs"
          textAlign="left"
          color="mono0"
          onPress={() => handleBannerLinkClick()}
        >
          {linkText}
        </LinkText>
      </Banner>
    )
  },
  LoadingFallback: () => null,
  ErrorFallback: () => null,
})
