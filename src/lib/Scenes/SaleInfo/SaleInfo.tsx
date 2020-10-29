import { SaleInfo_me } from "__generated__/SaleInfo_me.graphql"
import { SaleInfo_sale } from "__generated__/SaleInfo_sale.graphql"
import { SaleInfoQueryRendererQuery } from "__generated__/SaleInfoQueryRendererQuery.graphql"
import { MenuItem } from "lib/Components/MenuItem"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import moment from "moment"
import { Flex, Join, Sans, Separator, Text } from "palette"
import React from "react"
import { Linking, ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { navigate } from "../../navigation/navigate"
import { PlaceholderBox } from "../../utils/placeholders"
import { RegisterToBidButtonContainer } from "../Sale/Components/RegisterToBidButton"

interface Props {
  sale: SaleInfo_sale
  me: SaleInfo_me
}

const AuctionSupport = () => {
  return (
    <Flex mt={1}>
      <Sans px={2} size="5t" mb={15}>
        Auction support
      </Sans>
      <MenuItem
        title="Auction FAQs"
        onPress={() => {
          navigate("/auction-faq")
        }}
      />
      <MenuItem
        title="Contact us for help"
        onPress={() => {
          // PS: Opening Using Linking to open mail works only on real device on iOS
          Linking.openURL("mailto:specialist@artsy.net").catch((error) => {
            console.log(error)
          })
        }}
      />
    </Flex>
  )
}

const AuctionIsLive = () => (
  <Flex px={2} data-test-id="live-auction">
    <Sans size="5t" mb={2} mt={1}>
      This is a live auction
    </Sans>
    <Text variant="text" color="black" fontSize="size4">
      Participating in a live auction means you’ll be competing against bidders in real time on an auction room floor.
      You can place max bids which will be represented by Artsy in the auction room or you can bid live when the auction
      opens.
    </Text>
  </Flex>
)

export const SaleInfo: React.FC<Props> = ({ sale, me }) => {
  const renderLiveBiddingOpening = () => {
    if (!sale.liveStartAt || !moment().isSameOrBefore(moment(sale.liveStartAt)) || !sale.timeZone) {
      return null
    }

    return (
      <Flex mb={1}>
        <Text variant="text" color="black" fontSize="size4" mt={25} fontWeight="500">
          Live bidding opens on
        </Text>
        <Text variant="text" color="black" fontSize="size4">
          {`${moment(sale.liveStartAt).format("dddd, MMMM, D, YYYY")} at ${moment(sale.liveStartAt).format(
            "h:mma"
          )} ${moment.tz(sale.timeZone).zoneAbbr()}`}
        </Text>
      </Flex>
    )
  }

  return (
    <ScrollView>
      <Join separator={<Separator my={2} />}>
        {/*  About Auction */}
        <Flex px={2} mt={70}>
          <Sans size="8">About this auction</Sans>
          <Sans size="5" mt={1} mb={3}>
            {sale.name}
          </Sans>
          <RegisterToBidButtonContainer sale={sale} contextType="sale_information" me={me} />
          <Text variant="text" color="black" fontSize="size4" mt={25}>
            {sale.description}
          </Text>
          {renderLiveBiddingOpening()}
        </Flex>

        {/*  Live Auction Notice */}
        {Boolean(sale.liveStartAt) && <AuctionIsLive />}
        {/*  Auction Support */}
        <AuctionSupport />
      </Join>
    </ScrollView>
  )
}

const SaleInfoPlaceholder = () => (
  <Join separator={<Separator my={2} />}>
    <Flex px={2} mt={70}>
      <Sans size="8">About this auction</Sans>
      <Separator my={1} />
      <PlaceholderBox marginBottom={20} height={30} width={200 + Math.random() * 100} />
      <PlaceholderBox marginBottom={10} height={50} />
      <PlaceholderText marginBottom={20} height={30} width={200 + Math.random() * 100} />
      <PlaceholderBox marginBottom={10} height={120 + Math.random() * 100} width="100%" />
      <PlaceholderBox marginBottom={10} height={120 + Math.random() * 100} width="100%" />
      <PlaceholderBox marginBottom={10} height={120 + Math.random() * 100} width="100%" />
    </Flex>
  </Join>
)

export const SaleInfoContainer = createFragmentContainer(SaleInfo, {
  sale: graphql`
    fragment SaleInfo_sale on Sale {
      ...RegisterToBidButton_sale
      description
      endAt
      liveStartAt
      name
      startAt
      timeZone
    }
  `,
  me: graphql`
    fragment SaleInfo_me on Me {
      ...RegisterToBidButton_me @arguments(saleID: $saleID)
    }
  `,
})

export const SaleInfoQueryRenderer: React.FC<{ saleID: string }> = ({ saleID: saleID }) => {
  return (
    <QueryRenderer<SaleInfoQueryRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SaleInfoQueryRendererQuery($saleID: String!) {
          sale(id: $saleID) {
            ...SaleInfo_sale
          }
          me {
            ...SaleInfo_me
          }
        }
      `}
      variables={{ saleID }}
      render={renderWithPlaceholder({ Container: SaleInfoContainer, renderPlaceholder: SaleInfoPlaceholder })}
    />
  )
}

export const tests = { AuctionSupport, AuctionIsLive }
