import { storiesOf } from "@storybook/react-native"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { BidFlowRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import createEnvironment from "../../../relay/createEnvironment"

import { Flex } from "../Elements/Flex"
import { Sans12, Serif14, Serif16 } from "../Elements/Typography"

import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Checkbox } from "../Components/Checkbox"

import { NavigatorIOS, ScrollView } from "react-native"
import BidFlow from "../../../Containers/BidFlow"
import { Divider } from "../Components/Divider"
import { Input } from "../Components/Input"
import { Markdown } from "../Components/Markdown"
import { BidResultScreen } from "../Screens/BidResult"
import { BillingAddress } from "../Screens/BillingAddress"
import { ConfirmBid } from "../Screens/ConfirmBid"
import { ConfirmFirstTimeBid } from "../Screens/ConfirmFirstTimeBid"
import { MaxBidScreen } from "../Screens/SelectMaxBid"

const testSaleArtworkID = "5ae73b417622dd026f0fe473"
const testArtworkID = "ran-hwang-ephemeral-blossom-pp"
const testSaleID = "cityarts-benefit-auction-2018"

const selectMaxBidQuery = graphql`
  query BidFlowSelectMaxBidRendererQuery($saleArtworkID: String!) {
    sale_artwork(id: $saleArtworkID) {
      ...SelectMaxBid_sale_artwork
    }
  }
`

const bidResultQuery = graphql`
  query BidFlowBidResultScreenRendererQuery($saleArtworkID: String!) {
    sale_artwork(id: $saleArtworkID) {
      ...BidResult_sale_artwork
    }
  }
`

const BidFlowStoryRenderer: React.SFC<any> = ({ render, query, saleArtworkID }) => {
  return <QueryRenderer environment={createEnvironment()} query={query} variables={{ saleArtworkID }} render={render} />
}

storiesOf("Bidding")
  .add("Show bid flow", () => {
    return <BidFlowRenderer render={renderWithLoadProgress(BidFlow)} artworkID={testArtworkID} saleID={testSaleID} />
  })
  .add("Select Max Bid", () => (
    <BidFlowStoryRenderer
      render={renderWithLoadProgress(MaxBidScreen)}
      query={selectMaxBidQuery}
      saleArtworkID={testSaleArtworkID}
    />
  ))
  .add("Confirm Bid", () => {
    return (
      <ConfirmBid
        sale_artwork={{
          sale: {
            id: "1",
            live_start_at: "2018-06-11T01:00:00+00:00",
            end_at: null,
          },
          artwork: {
            id: "1",
            title: "Morgan Hill (Prototype)",
            date: "1973",
            artist_names: "Lewis balts",
          },
          lot_label: "1",
        }}
        bid={{ display: "$45,000", cents: 4500000 }}
      />
    )
  })
  .add("Confirm Bid (first time)", () => {
    return (
      <NavigatorIOS
        navigationBarHidden={true}
        initialRoute={{
          component: ConfirmFirstTimeBid,
          title: "",
          passProps: {
            sale_artwork: {
              sale: {
                id: "1",
                live_start_at: "2018-06-11T01:00:00+00:00",
                end_at: null,
              },
              artwork: {
                id: "1",
                title: "Morgan Hill (Prototype)",
                date: "1973",
                artist_names: "Lewis balts",
              },
              lot_label: "1",
            },
            bid: { display: "$45,000", cents: 4500000 },
          },
        }}
        style={{ flex: 1 }}
      />
    )
  })
  .add("Bidding Result (winning)", () => {
    const status = "SUCCESS"
    return (
      <BidFlowStoryRenderer
        render={renderWithLoadProgress(BidResultScreen, {
          winning: true,
          status,
        })}
        query={bidResultQuery}
        saleArtworkID={testSaleArtworkID}
      />
    )
  })
  .add("Bidding Result (not highest bid)", () => {
    const status = "OUTBID"
    const messageHeader = "Your bid wasn’t high enough"
    const messageDescriptionMd = `Another bidder placed a higher max bid or the same max bid before you did.  \
 Bid again to take the lead.`
    return (
      <BidFlowStoryRenderer
        render={renderWithLoadProgress(BidResultScreen, {
          winning: false,
          status,
          message_header: messageHeader,
          message_description_md: messageDescriptionMd,
        })}
        query={bidResultQuery}
        saleArtworkID={testSaleArtworkID}
      />
    )
  })
  .add("Billing Address", () => {
    return <BillingAddress />
  })
  .add("Bidding Result (live bidding started)", () => {
    const status = "ERROR_LIVE_BIDDING_STARTED"
    const messageHeader = "Live bidding has started"
    const messageDescriptionMd = `Sorry, your bid wasn’t received before live bidding started.\
 To continue bidding, please [join the live auction](http://live-staging.artsy.net/).`
    return (
      <BidFlowStoryRenderer
        render={renderWithLoadProgress(BidResultScreen, {
          winning: false,
          status,
          message_header: messageHeader,
          message_description_md: messageDescriptionMd,
        })}
        query={bidResultQuery}
        saleArtworkID={testSaleArtworkID}
      />
    )
  })

storiesOf("App Style/Utils").add("Markdown", () => (
  <BiddingThemeProvider>
    <ScrollView>
      <Markdown m={4} alignItems="center">
        Another bidder placed a higher max bid{"\n"}
        or the same max bid before you did.{"\n"}
        {"\n"}
        Bid again to take the lead.
      </Markdown>

      <Divider />

      <Markdown m={4} alignItems="center">
        Your bid didn’t meet the reserve price{"\n"}
        for this work.{"\n"}
        {"\n"}
        Bid again to take the lead.
      </Markdown>

      <Divider />

      <Markdown m={4} alignItems="center">
        Sorry, your bid wasn’t received{"\n"}
        before the lot closed.
      </Markdown>

      <Divider />

      <Markdown m={4} alignItems="center">
        Sorry, your bid wasn’t received before{"\n"}
        live bidding started. To continue{"\n"}
        bidding, please [join the live auction](http://www.artsy.net).
      </Markdown>

      <Divider />

      <Markdown m={4} alignItems="center">
        Your bid couldn’t be placed. Please{"\n"}
        check your internet connection{"\n"}
        and try again.
      </Markdown>

      <Divider />

      <Markdown m={4} alignItems="center">
        Your bid can’t be placed at this time.{"\n"}
        Please contact [support@artsy.net](mailto:support@artsy.net) for{"\n"}
        more information.
      </Markdown>

      <Divider />

      <Markdown m={4} alignItems="center">
        We’re receiving a high volume of traffic{"\n"}
        and your bid is still processing.{"\n"}
        {"\n"}
        If you don’t receive an update soon,{"\n"}
         please contact [support@artsy.net](mailto:support@artsy.net).
      </Markdown>
    </ScrollView>
  </BiddingThemeProvider>
))

storiesOf("App Style/Input")
  .add("Text Input", () => (
    <BiddingThemeProvider>
      <Flex mt={7} ml={4} mr={4}>
        <Serif16 mb={2}>Title</Serif16>
        <Input placeholder="Placeholder" mb={5} />

        <Serif16>Title</Serif16>
        <Serif14 mb={2} color="black60">
          Short description
        </Serif14>
        <Input placeholder="Placeholder" value="Content" mb={5} />

        <Input placeholder="Without Title" mb={5} />

        <Serif16 mb={2}>Error</Serif16>
        <Input error placeholder="Placeholder" mb={3} />
        <Sans12 color="red100">Error message</Sans12>
      </Flex>
    </BiddingThemeProvider>
  ))
  .add("Check Boxes", () => (
    <BiddingThemeProvider>
      <Flex mt={7}>
        <Checkbox pl={3} pb={1}>
          <Serif16 mt={2}>Remember me</Serif16>
        </Checkbox>

        <Checkbox pl={3} pb={1} checked>
          <Serif16 mt={2}>Remember me</Serif16>
        </Checkbox>

        <Checkbox pl={3} pb={1} error>
          <Serif16 mt={2} color="red100">
            Agree to Terms and Conditions
          </Serif16>
        </Checkbox>

        <Checkbox pl={3} pb={1} checked error>
          <Serif16 mt={2} color="red100">
            Agree to Terms and Conditions
          </Serif16>
        </Checkbox>

        <Checkbox pl={3} pb={1} disabled>
          <Serif16 mt={2}>Remember me</Serif16>
        </Checkbox>

        <Checkbox pl={3} pb={1} checked disabled>
          <Serif16 mt={2}>Remember me</Serif16>
        </Checkbox>
      </Flex>
    </BiddingThemeProvider>
  ))
