import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Text, Separator, Join, useSpace } from "@artsy/palette-mobile"
import { SaleInfoQueryRendererQuery } from "__generated__/SaleInfoQueryRendererQuery.graphql"
import { SaleInfo_me$data } from "__generated__/SaleInfo_me.graphql"
import { SaleInfo_sale$data } from "__generated__/SaleInfo_sale.graphql"
import { Markdown } from "app/Components/Markdown"
import { MenuItem } from "app/Components/MenuItem"
import { RegisterToBidButtonContainer } from "app/Scenes/Sale/Components/RegisterToBidButton"
import { saleStatus } from "app/Scenes/Sale/helpers"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { PlaceholderText, PlaceholderBox } from "app/utils/placeholders"
import { defaultRules } from "app/utils/renderMarkdown"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { sendEmail } from "app/utils/sendEmail"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import moment from "moment-timezone"
import { useEffect, useRef } from "react"
import { PanResponder, Platform, ScrollView, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Props {
  sale: SaleInfo_sale$data
  me: SaleInfo_me$data
}

const AuctionSupport = () => {
  return (
    <Flex mt={1}>
      <Text variant="sm-display" px={2} mb="15px">
        Auction support
      </Text>
      <MenuItem title="Auction FAQs" href="/auction-faq" />
      <MenuItem
        title="Contact us for help"
        onPress={() => {
          sendEmail("specialist@artsy.net")
        }}
      />
    </Flex>
  )
}

const AuctionIsLive = () => (
  <Flex px={2} testID="live-auction">
    <Text variant="sm-display" mb={2} mt={1}>
      This is a live auction
    </Text>
    <Text variant="sm" color="mono100" fontSize={15}>
      Participating in a live auction means you’ll be competing against bidders in real time on an
      auction room floor. You can place max bids which will be represented by Artsy in the auction
      room or you can bid live when the auction opens.
    </Text>
  </Flex>
)

const markdownRules = defaultRules({ useNewTextStyles: true })

export const SaleInfo: React.FC<Props> = ({ sale, me }) => {
  const space = useSpace()

  const panResponder = useRef<any>(null)
  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
    })
  }, [])

  const renderLiveBiddingOpening = () => {
    if (!sale.liveStartAt || !moment().isSameOrBefore(moment(sale.liveStartAt)) || !sale.timeZone) {
      return null
    }

    const tz = moment.tz.guess(true)

    return (
      <Flex mb={1}>
        <Text variant="sm" color="mono100" fontSize={15} mt={25} fontWeight="500">
          Live bidding opens on
        </Text>
        <Text variant="sm" color="mono100" fontSize={15}>
          {`${moment(sale.liveStartAt).format("dddd, MMMM, D, YYYY")} at ${moment(sale.liveStartAt)
            .tz(tz)
            .format("h:mma z")}`}
        </Text>
      </Flex>
    )
  }

  return (
    <ProvideScreenTracking info={tracks.screen(sale.internalID, sale.slug)}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30, paddingTop: space(2) }}>
        <Join separator={<Separator my={2} />}>
          {/*  About Auction */}
          <Flex px={2}>
            <Text variant="lg-display">About this auction</Text>
            <Text variant="sm-display" mt={1} mb={4}>
              {sale.name}
            </Text>
            {saleStatus(sale.startAt, sale.endAt, sale.registrationEndsAt) === "closed" || (
              <Flex mb={4} testID="register-to-bid-button">
                <RegisterToBidButtonContainer
                  sale={sale}
                  contextType={OwnerType.saleInformation}
                  me={me}
                  contextModule={ContextModule.aboutThisAuction}
                />
              </Flex>
            )}
            {Platform.OS === "ios" ? (
              <View {...(panResponder.current?.panHandlers || {})}>
                <Markdown rules={markdownRules}>{sale.description ?? ""}</Markdown>
              </View>
            ) : (
              <Markdown rules={markdownRules}>{sale.description || ""}</Markdown>
            )}
            {renderLiveBiddingOpening()}
          </Flex>

          {Boolean(sale.liveStartAt) && <AuctionIsLive />}
          {!!sale.isWithBuyersPremium && <BuyersPremium sale={sale} />}
          <AuctionSupport />
        </Join>
      </ScrollView>
    </ProvideScreenTracking>
  )
}

const makePercent = (value: number) => parseFloat((value * 100).toFixed(5))

const createPremiumDisplay = (props: { sale: SaleInfo_sale$data }) => {
  return props.sale.buyersPremium?.map((item, index) => (
    <BuyersPremiumItem sale={props.sale} currentValue={item} index={index} key={index} />
  ))
}

interface BuyersPremiumItemProps {
  sale: SaleInfo_sale$data
  currentValue:
    | {
        amount: string | null | undefined
        percent: number | null | undefined
      }
    | null
    | undefined
  index: number
}

const BuyersPremiumItem: React.FC<BuyersPremiumItemProps> = (props) => {
  let premiumText

  const buyersPremium = props.sale.buyersPremium
  const amount = props.currentValue?.amount
  const percent = makePercent(props.currentValue?.percent || 0) + "%"
  const listLength = props.sale.buyersPremium?.length || 0

  const nextValue = !!buyersPremium ? buyersPremium[props.index + 1] : null

  if (props.index === 0) {
    premiumText = `On the hammer price up to and including ${nextValue?.amount}: ${percent}`
  } else if (props.index === listLength - 1) {
    premiumText = `On the portion of the hammer price in excess of ${amount}: ${percent}`
  } else {
    premiumText = `On the hammer price in excess of ${amount} up to and including ${nextValue?.amount}: ${percent}`
  }
  return (
    <Text variant="sm" mb={1}>
      {premiumText}
    </Text>
  )
}

const BuyersPremium: React.FC<{ sale: SaleInfo_sale$data }> = (props) => {
  let premiumDisplay

  const buyersPremium = props.sale.buyersPremium
  if (!buyersPremium || buyersPremium?.length === 0) {
    return null
  }

  if (buyersPremium.length === 1) {
    premiumDisplay = (
      <Text variant="sm">{makePercent(buyersPremium[0]?.percent || 0)}% on the hammer price</Text>
    )
  } else {
    premiumDisplay = createPremiumDisplay(props)
  }
  return (
    <Flex px={2}>
      <Text variant="sm-display" mb={2} mt={1}>
        Buyer's Premium for this Auction
      </Text>
      {premiumDisplay}
    </Flex>
  )
}

const SaleInfoPlaceholder = () => (
  <Join separator={<Separator my={2} />}>
    <Flex px={2}>
      <Text variant="lg-display" mt={2}>
        About this auction
      </Text>
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

export const tracks = {
  screen: (id: string, slug: string) => {
    return {
      context_screen: Schema.PageNames.AuctionInfo,
      context_screen_owner_type: Schema.OwnerEntityTypes.AuctionInfo,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
    }
  },
}

export const SaleInfoContainer = createFragmentContainer(SaleInfo, {
  sale: graphql`
    fragment SaleInfo_sale on Sale {
      ...RegisterToBidButton_sale
      description
      slug
      internalID
      endAt
      liveStartAt
      name
      startAt
      registrationEndsAt
      timeZone
      isWithBuyersPremium
      buyersPremium {
        amount
        percent
      }
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
      environment={getRelayEnvironment()}
      query={graphql`
        query SaleInfoQueryRendererQuery($saleID: String!) {
          sale(id: $saleID) {
            ...SaleInfo_sale
          }
          me @optionalField {
            ...SaleInfo_me
          }
        }
      `}
      variables={{ saleID }}
      render={renderWithPlaceholder({
        Container: SaleInfoContainer,
        renderPlaceholder: SaleInfoPlaceholder,
      })}
    />
  )
}

export const tests = { AuctionSupport, AuctionIsLive }
