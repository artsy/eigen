import { CloseIcon } from "@artsy/icons/native"
import { Flex, useSpace, Text, Screen, Touchable } from "@artsy/palette-mobile"
import { AuctionBuyersPremiumQuery } from "__generated__/AuctionBuyersPremiumQuery.graphql"
import { AuctionBuyersPremium_sale$data } from "__generated__/AuctionBuyersPremium_sale.graphql"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { PlaceholderRaggedText, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { compact } from "lodash"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface AuctionBuyersPremiumProps {
  sale: AuctionBuyersPremium_sale$data
}

interface AuctionBuyersPremiumQueryRendererProps {
  saleID: string
}

export const AuctionBuyersPremium: React.FC<AuctionBuyersPremiumProps> = ({ sale }) => {
  const space = useSpace()
  const schedule = compact(sale.buyersPremium).sort((a, b) => (a.cents ?? 0) - (b.cents ?? 0))

  return (
    <Screen>
      <Screen.Header
        leftElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={() => goBack()}
            hitSlop={{ top: space(2), left: space(2), bottom: space(2), right: space(2) }}
          >
            <CloseIcon fill="mono100" />
          </Touchable>
        }
      />
      <Screen.Body>
        <ScrollView contentContainerStyle={{ paddingTop: space(2), paddingBottom: space(4) }}>
          <Text variant="lg-display" mb={1}>
            What is a Buyer’s Premium?
          </Text>

          <Text variant="sm">
            A buyer’s premium is a charge the winning bidder pays in addition to the lot’s hammer
            price. It is calculated as a percentage of the hammer price, at the rates indicated
            below. If a lot has a buyer’s premium, this will be indicated on the bidding screen
            where you place your bid. After the auction, the winning bidder will receive a summary
            of their purchase, including the hammer price and buyer’s premium, along with any
            applicable taxes.
          </Text>

          {schedule.length > 0 && (
            <>
              <Text variant="lg-display" mt={2} mb={1}>
                Buyer’s Premium For This Auction on Artsy
              </Text>

              {schedule.length === 1 ? (
                <Text variant="sm">{(schedule[0].percent ?? 0) * 100}% on the hammer price</Text>
              ) : (
                schedule.map((premium, i) => {
                  const percent = (premium.percent ?? 0) * 100
                  const hasDecimal = percent - Math.floor(percent) !== 0
                  const fixed = percent.toFixed(1)
                  const displayPercentage = hasDecimal ? fixed : percent

                  // First
                  if (i === 0) {
                    return (
                      <Text key={i} variant="sm" mb={0.5}>
                        On the hammer price up to and including {schedule[i + 1]?.amount}:{" "}
                        {displayPercentage}%
                      </Text>
                    )
                  }

                  // Last
                  if (i === schedule.length - 1) {
                    return (
                      <Text key={i} variant="sm">
                        On the portion of the hammer price in excess of {premium?.amount}:{" "}
                        {displayPercentage}%
                      </Text>
                    )
                  }

                  return (
                    <Text key={i} variant="sm" mb={0.5}>
                      On the hammer price in excess of {premium.amount} up to and including{" "}
                      {schedule[i + 1].amount}: {displayPercentage}%
                    </Text>
                  )
                })
              )}
            </>
          )}
        </ScrollView>
      </Screen.Body>
    </Screen>
  )
}

const AuctionBuyersPremiumFragmentContainer = createFragmentContainer(AuctionBuyersPremium, {
  sale: graphql`
    fragment AuctionBuyersPremium_sale on Sale {
      buyersPremium {
        amount
        cents
        percent
      }
    }
  `,
})

const AuctionBuyersPremiumLoadingPlaceholder: React.FC = () => {
  const space = useSpace()
  return (
    <Screen>
      <Screen.Header
        leftElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={() => goBack()}
            hitSlop={{ top: space(2), left: space(2), bottom: space(2), right: space(2) }}
          >
            <CloseIcon fill="mono100" />
          </Touchable>
        }
      />
      <Flex flex={1} m={2}>
        <PlaceholderText height={25} width={200} marginBottom={20} />
        <PlaceholderRaggedText textHeight={15} numLines={12} />

        <PlaceholderText height={25} width={200} marginTop={20} />
        <PlaceholderText height={25} width={120} marginBottom={10} />
        <PlaceholderRaggedText textHeight={15} numLines={5} />
      </Flex>
    </Screen>
  )
}

export const AuctionBuyersPremiumQueryRenderer: React.FC<
  AuctionBuyersPremiumQueryRendererProps
> = ({ saleID }) => {
  return (
    <QueryRenderer<AuctionBuyersPremiumQuery>
      environment={getRelayEnvironment()}
      variables={{ saleID }}
      query={graphql`
        query AuctionBuyersPremiumQuery($saleID: String!) {
          sale(id: $saleID) {
            ...AuctionBuyersPremium_sale
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: AuctionBuyersPremiumFragmentContainer,
        renderPlaceholder: () => <AuctionBuyersPremiumLoadingPlaceholder />,
      })}
    />
  )
}
