import { storiesOf } from "@storybook/react-native"
import React from "react"

import { ScrollView } from "react-native"
import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { Divider } from "../Divider"
import { Markdown } from "../Markdown"

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
