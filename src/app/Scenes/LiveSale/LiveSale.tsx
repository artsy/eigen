import { CloseIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, Screen, Spinner, Text, Touchable } from "@artsy/palette-mobile"
import { LiveSaleQuery } from "__generated__/LiveSaleQuery.graphql"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

interface LiveSaleProps {
  slug: string
}

const LiveSaleComponent: React.FC<LiveSaleProps> = ({ slug }) => {
  const data = useLazyLoadQuery<LiveSaleQuery>(
    liveSaleQuery,
    { saleID: slug },
    {
      fetchPolicy: "network-only",
    }
  )

  // This won't happen because the query would fail
  // Adding it here to make TS happy
  if (!data.sale) {
    return (
      <Screen>
        <Screen.Header
          leftElements={
            <Touchable
              accessibilityRole="button"
              accessibilityLabel="Exit Sale"
              hitSlop={DEFAULT_HIT_SLOP}
              onPress={() => goBack()}
            >
              <CloseIcon />
            </Touchable>
          }
        />
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Text>Sale not found.</Text>
        </Flex>
      </Screen>
    )
  }

  const saleData = {
    name: data.sale.name,
    causalitySaleID: data.sale.internalID,
    startDate: data.sale.startAt,
  }

  const credentials = {
    jwt: data.system?.causalityJWT ?? null,
    bidderID: data.me?.bidders?.[0]?.internalID ?? null,
    paddleNumber: data.me?.paddleNumber ?? null,
    userID: data.me?.internalID ?? null,
    canBid: (data.me?.bidders?.length ?? 0) > 0,
  }

  return (
    <Screen>
      <Screen.Header
        leftElements={
          // TODO: Is this the preferred way to have close icon? should we use NavigationHeader?
          // update Screen.Header to more easily support close icon?
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Exit Sale"
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={() => goBack()}
          >
            <CloseIcon />
          </Touchable>
        }
      />
      <Flex flex={1} p={2}>
        <Text variant="lg-display" mb={2}>
          {saleData.name}
        </Text>
        <Text variant="sm" color="black60" mb={1}>
          Causality Sale ID: {saleData.causalitySaleID}
        </Text>
        <Text variant="sm" color="black60" mb={1}>
          Start Date: {saleData.startDate}
        </Text>
        <Text variant="sm" color="black60" mb={1}>
          Can Bid: {credentials.canBid ? "Yes" : "No"}
        </Text>
        {!!credentials.paddleNumber && (
          <Text variant="sm" color="black60">
            Paddle: {credentials.paddleNumber}
          </Text>
        )}
      </Flex>
    </Screen>
  )
}

const liveSaleQuery = graphql`
  query LiveSaleQuery($saleID: String!) {
    sale(id: $saleID) {
      name
      internalID
      startAt
    }
    system {
      causalityJWT(saleID: $saleID)
    }
    me {
      internalID
      paddleNumber
      bidders(saleID: $saleID) {
        internalID
      }
    }
  }
`

export const LiveSale = withSuspense({
  Component: LiveSaleComponent,
  LoadingFallback: () => (
    <Screen>
      <Screen.Header
        leftElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Exit Sale"
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={() => goBack()}
          >
            <CloseIcon />
          </Touchable>
        }
      />
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    </Screen>
  ),
  ErrorFallback: () => (
    <Screen>
      <Screen.Header
        leftElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Exit Sale"
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={() => goBack()}
          >
            <CloseIcon />
          </Touchable>
        }
      />
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text>Unable to load auction. Please try again later.</Text>
      </Flex>
    </Screen>
  ),
})
