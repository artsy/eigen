import React from "react"
import { NavigatorIOS, ViewProperties } from "react-native"

import { Schema, screenTrack } from "../../../utils/track"

import { Flex } from "../Elements/Flex"

import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Button } from "../Components/Button"
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
          <Title>Your max bid</Title>

          <MaxBidPicker
            bids={bids}
            onValueChange={(_, index) => this.setState({ selectedBidIndex: index })}
            selectedValue={this.state.selectedBidIndex}
          />

          <Flex m={4}>
            <Button text="Select bid" onPress={this.onPressNext} />
          </Flex>
        </Container>
      </BiddingThemeProvider>
    )
  }
}
