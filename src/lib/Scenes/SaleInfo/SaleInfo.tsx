import { SaleInfo_sale } from "__generated__/SaleInfo_sale.graphql"
import { SaleInfoQueryRendererQuery } from "__generated__/SaleInfoQueryRendererQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { saleTime } from "lib/utils/saleTime"
import moment from "moment"
import { Flex, Join, Sans, Separator, Text } from "palette"
import React, { useRef } from "react"
import { Linking, ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { PlaceholderBox } from "../../utils/placeholders"
import { MyProfileMenuItem } from "../MyProfile/Components/MyProfileMenuItem"
import { RegisterToBidButton } from "../Sale/Components/RegisterToBidButton"

interface Props {
  sale: SaleInfo_sale
}

export const AuctionSupport = () => {
  const navRef = useRef(null)
  return (
    <Flex>
      <Sans px={2} size="5t" mb={15}>
        Auction support
      </Sans>
      <MyProfileMenuItem
        title="Auction FAQs"
        onPress={() => {
          SwitchBoard.presentNavigationViewController(navRef.current!, "my-account/edit-name")
        }}
      />
      <MyProfileMenuItem
        title="Contact us for help"
        onPress={() => {
          Linking.openURL("mailto:specialist@artsy.net").catch((error) => {
            console.log(error)
          })
        }}
      />
    </Flex>
  )
}

export const AuctionIsLive = () => (
  <Flex px={2} data-test-id="live-auction">
    <Sans size="5t">This is a live auction</Sans>
    <Text variant="text" color="black" fontSize="size4">
      Participating in a live auction means you’ll be competing against bidders in real time on an auction room floor.
      You can place max bids which will be represented by Artsy in the auction room or you can bid live when the auction
      opens.
    </Text>
  </Flex>
)

export const SaleInfo: React.FC<Props> = ({ sale }) => {
  const isLiveBiddingAvailable = () => {
    if (!sale.liveStartAt) {
      return false
    }
    return moment(sale.liveStartAt).isAfter(moment())
  }

  const saleTimeDetails = saleTime(sale)

  const renderLiveBiddingOpening = () => {
    if (!isLiveBiddingAvailable()) {
      return null
    }

    return (
      <Flex>
        <Text variant="text" color="black" fontSize="size4" mt={25} fontWeight="500">
          {saleTimeDetails?.absolute.headline}
        </Text>
        <Text variant="text" color="black" fontSize="size4">
          {saleTimeDetails?.absolute.date}
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
          <RegisterToBidButton sale={sale} contextType="sale_information" />
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
      description
      endAt
      liveStartAt
      name
      startAt
      timeZone
      ...RegisterToBidButton_sale
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
        }
      `}
      variables={{ saleID }}
      render={renderWithPlaceholder({ Container: SaleInfoContainer, renderPlaceholder: SaleInfoPlaceholder })}
    />
  )
}
