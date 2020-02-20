import React from "react"
import { View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

import { Schema, screenTrack } from "../../../utils/track"

import { Box, Button } from "@artsy/palette"
import { BackButton } from "lib/Components/Bidding/Components/BackButton"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Container } from "../Components/Containers"
import { MaxBidPicker } from "../Components/MaxBidPicker"
import { Title } from "../Components/Title"

interface SelectMaxBidProps extends ViewProperties {
  increments: any[]
  navigator: NavigatorIOS
  updateSelectedBid: (selectedBidIndex: number) => void
  selectedBidIndex: number
}

interface SelectMaxBidState {
  selectedBidIndex: number
}

@screenTrack({
  context_screen: Schema.PageNames.BidFlowMaxBidPage,
  context_screen_owner_type: null,
})
export class SelectMaxBidEdit extends React.Component<SelectMaxBidProps, SelectMaxBidState> {
  state = {
    selectedBidIndex: this.props.selectedBidIndex || 0,
  }

  onPressNext = () => {
    this.props.updateSelectedBid(this.state.selectedBidIndex)
    this.props.navigator.pop()
  }

  render() {
    const bids = this.props.increments || []

    return (
      <BiddingThemeProvider>
        <Container m={0}>
          <View>
            <BackButton navigator={this.props.navigator} />
            <Title>Your max bid</Title>
          </View>

          <MaxBidPicker
            bids={bids}
            onValueChange={(_, index) => this.setState({ selectedBidIndex: index })}
            selectedValue={this.state.selectedBidIndex}
          />

          <Box m={4}>
            <Button onPress={this.onPressNext} block width={100}>
              Next
            </Button>
          </Box>
        </Container>
      </BiddingThemeProvider>
    )
  }
}
