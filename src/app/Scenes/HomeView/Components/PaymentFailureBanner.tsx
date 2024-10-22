import { Banner } from "@artsy/palette-mobile"
import { PaymentFailureBanner_Query } from "__generated__/PaymentFailureBanner_Query.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useLazyLoadQuery } from "react-relay"

export const PaymentFailureBanner: React.FC = () => {
  const data = useLazyLoadQuery<PaymentFailureBanner_Query>(query, {})
  const orders = extractNodes(data?.me?.orders)

  const failedPayments = orders?.filter((order) => order?.paymentSet === false) || []

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
    me @required(action: NONE) {
      orders(first: 10) @connection(key: "PaymentFailureBanner_orders") {
        edges {
          node {
            code
            internalID
            displayState
            ... on CommerceOrder {
              paymentSet
            }
          }
        }
      }
    }
  }
`
