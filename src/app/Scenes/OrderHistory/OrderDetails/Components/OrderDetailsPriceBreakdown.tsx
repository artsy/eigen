import { Box, Flex, LinkText, Spacer, Text } from "@artsy/palette-mobile"
import {
  OrderDetailsPriceBreakdown_order$data,
  OrderDetailsPriceBreakdown_order$key,
} from "__generated__/OrderDetailsPriceBreakdown_order.graphql"
import { useOrderDetailsTracking } from "app/Scenes/OrderHistory/OrderDetails/hooks/useOrderDetailsTracking"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

interface OrderDetailsPriceBreakdownProps {
  order: OrderDetailsPriceBreakdown_order$key
}

const IMPORT_TAX_URL =
  "https://support.artsy.net/s/article/How-are-taxes-and-customs-fees-calculated"

type PriceBreakdownLine = OrderDetailsPriceBreakdown_order$data["pricingBreakdownLines"][number]

export const OrderDetailsPriceBreakdown: React.FC<OrderDetailsPriceBreakdownProps> = ({
  order,
}) => {
  const { pricingBreakdownLines, internalID, source, mode } = useFragment(fragment, order)
  const orderDetailTracks = useOrderDetailsTracking()

  const renderBreakdownLines = (line: PriceBreakdownLine, index: number) => {
    if (!line) {
      return null
    }

    switch (line.__typename) {
      case "SubtotalLine":
        return (
          <PriceBreakdownLine
            key={index}
            amount={line.amount ? `${line.amount.currencySymbol}${line.amount.amount}` : ""}
            label={line.displayName}
          />
        )

      case "ShippingLine":
        return (
          <PriceBreakdownLine
            key={index}
            amount={
              line.amount
                ? `${line.amount.currencySymbol}${line.amount.amount}`
                : (line.amountFallbackText as string)
            }
            label={line.displayName}
          />
        )

      case "TaxLine":
        return (
          <PriceBreakdownLine
            key={index}
            amount={
              line.amount
                ? `${line.amount.currencySymbol}${line.amount.amount}`
                : (line.amountFallbackText as string)
            }
            label={`${line.displayName}*`}
          />
        )

      case "TotalLine":
        return (
          <PriceBreakdownLine
            key={index}
            isTotal
            amount={line.amount?.display || line.amountFallbackText || ""}
            label={line.displayName}
          />
        )

      default:
        return null
    }
  }

  return (
    <Box my={1}>
      {pricingBreakdownLines.map(renderBreakdownLines)}

      <Spacer y={2} />

      <Text variant="xs" color="mono60">
        *Additional duties and taxes{" "}
        <LinkText
          onPress={() => {
            orderDetailTracks.tappedImportFees(internalID, mode, source)
            navigate(IMPORT_TAX_URL)
          }}
          variant="xs"
          color="mono60"
        >
          may apply at import
        </LinkText>
        .
      </Text>
    </Box>
  )
}

const fragment = graphql`
  fragment OrderDetailsPriceBreakdown_order on Order {
    internalID
    mode
    source
    pricingBreakdownLines {
      __typename
      ... on ShippingLine {
        displayName
        amountFallbackText
        amount {
          amount
          currencySymbol
        }
      }
      ... on TaxLine {
        displayName
        amountFallbackText
        amount {
          amount
          currencySymbol
        }
      }
      ... on SubtotalLine {
        displayName
        amount {
          amount
          currencySymbol
        }
      }
      ... on TotalLine {
        displayName
        amountFallbackText
        amount {
          display
        }
      }
    }
  }
`

interface PriceBreakdownLineProps {
  label: string
  amount: string
  isTotal?: boolean
}

const PriceBreakdownLine: React.FC<PriceBreakdownLineProps> = ({
  amount,
  label,
  isTotal = false,
}) => {
  return (
    <>
      {!!isTotal && <Spacer y={0.5} />}

      <Flex flexDirection="row" justifyContent="space-between">
        <Text
          variant="sm"
          color={isTotal ? "mono100" : "mono60"}
          fontWeight={isTotal ? "bold" : "normal"}
        >
          {label}
        </Text>
        <Text
          variant="sm"
          color={isTotal ? "mono100" : "mono60"}
          fontWeight={isTotal ? "bold" : "normal"}
        >
          {amount}
        </Text>
      </Flex>
    </>
  )
}
