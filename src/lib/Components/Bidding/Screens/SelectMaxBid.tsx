import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { ViewProperties } from "react-native"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"

import Spinner from "../../../Components/Spinner"
import { Schema, screenTrack } from "../../../utils/track"

import { Box, Button } from "palette"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Container } from "../Components/Containers"
import { MaxBidPicker } from "../Components/MaxBidPicker"
import { Title } from "../Components/Title"

import { ConfirmBidScreen } from "./ConfirmBid"

import { SelectMaxBid_me } from "__generated__/SelectMaxBid_me.graphql"
import { SelectMaxBid_sale_artwork } from "__generated__/SelectMaxBid_sale_artwork.graphql"

interface SelectMaxBidProps extends ViewProperties {
  sale_artwork: SelectMaxBid_sale_artwork
  me: SelectMaxBid_me
  navigator: NavigatorIOS
  relay: RelayRefetchProp
}

interface SelectMaxBidState {
  selectedBidIndex: number
  isRefreshingSaleArtwork: boolean
}

@screenTrack({
  context_screen: Schema.PageNames.BidFlowMaxBidPage,
  context_screen_owner_type: null,
})
export class SelectMaxBid extends React.Component<SelectMaxBidProps, SelectMaxBidState> {
  state = {
    selectedBidIndex: 0,
    isRefreshingSaleArtwork: false,
  }

  refreshSaleArtwork = () => {
    this.setState({ isRefreshingSaleArtwork: true })
    this.props.relay.refetch(
      { saleArtworkNodeID: this.props.sale_artwork.id },
      null,
      () => {
        this.setState({ isRefreshingSaleArtwork: false })
      },
      { force: true }
    )
  }

  onPressNext = () => {
    this.props.navigator.push({
      component: ConfirmBidScreen,
      title: "",
      passProps: {
        ...this.props,
        increments: this.props.sale_artwork.increments,
        selectedBidIndex: this.state.selectedBidIndex,
        refreshSaleArtwork: this.refreshSaleArtwork,
      },
    })
  }

  render() {
    const bids = (this.props.sale_artwork && this.props.sale_artwork.increments) || []

    return (
      <BiddingThemeProvider>
        <Container m={0}>
          <Title>Your max bid</Title>

          {this.state.isRefreshingSaleArtwork ? (
            <Spinner />
          ) : (
            <MaxBidPicker
              // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
              bids={bids}
              onValueChange={(_, index) => this.setState({ selectedBidIndex: index })}
              selectedValue={this.state.selectedBidIndex}
            />
          )}

          <Box m="4">
            <Button block width={100} onPress={this.onPressNext}>
              Next
            </Button>
          </Box>
        </Container>
      </BiddingThemeProvider>
    )
  }
}

export const MaxBidScreen = createRefetchContainer(
  SelectMaxBid,
  {
    sale_artwork: graphql`
      fragment SelectMaxBid_sale_artwork on SaleArtwork {
        id
        increments(useMyMaxBid: true) {
          display
          cents # Used on the ConfirmBid screen
        }
        ...ConfirmBid_sale_artwork
      }
    `,
    me: graphql`
      fragment SelectMaxBid_me on Me {
        ...ConfirmBid_me
      }
    `,
  },
  graphql`
    query SelectMaxBidRefetchQuery($saleArtworkNodeID: ID!) {
      node(id: $saleArtworkNodeID) {
        ...SelectMaxBid_sale_artwork
      }
    }
  `
)
