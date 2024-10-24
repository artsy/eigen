import { Banner } from "@artsy/palette-mobile"
import { PaymentFailureBanner_Query } from "__generated__/PaymentFailureBanner_Query.graphql"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useEffect } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const PaymentFailureBanner: React.FC = () => {
  const data = useLazyLoadQuery<PaymentFailureBanner_Query>(query, {})
  const failedPayments = extractNodes(data?.commerceMyOrders)

  useEffect(() => {
    if (failedPayments.length) {
      console.warn("trackBannerView")
    }
  }, [])

  const handleBannerLinkClick = () => {
    console.warn("trackBannerLinkClick")

    failedPayments.length === 1
      ? navigate(`orders/${failedPayments[0].internalID}/payment/new`)
      : navigate(`settings/purchases`)
  }

  if (failedPayments.length === 0) {
    return null
  }

  const bannerText =
    failedPayments.length === 1
      ? "Payment failed for your recent order.\nUpdate payment method."
      : "Payment failed for your recent orders.\nUpdate payment method for each order."

  return <Banner variant="error" text={bannerText} dismissable />
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
