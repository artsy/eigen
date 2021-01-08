import React from "react"
import { TouchableWithoutFeedback, View, ViewProperties } from "react-native"

import { Schema, screenTrack } from "../../../utils/track"

import { StackScreenProps } from "@react-navigation/stack"
import { BidFlowStackProps } from "lib/Containers/BidFlow"
import { isPad } from "lib/utils/hardware"
import { Box, Button } from "palette"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Container } from "../Components/Containers"
import { MaxBidPicker } from "../Components/MaxBidPicker"
import { Title } from "../Components/Title"
import { Image } from "../Elements/Image"

interface SelectMaxBidProps extends ViewProperties, StackScreenProps<BidFlowStackProps, "SelectMaxBidEdit"> {
  increments: any[]
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
    selectedBidIndex: this.props.route.params?.selectedBidIndex || 0,
  }

  onPressNext = () => {
    // this.props.updateSelectedBid(this.state.selectedBidIndex)
    this.props.navigation.goBack()
  }

  render() {
    const bids = this.props.increments || []

    return (
      <BiddingThemeProvider>
        <Container m={0}>
          <View>
            <TouchableWithoutFeedback onPress={this.props.navigation.goBack}>
              <Image
                position="absolute"
                top={isPad() ? "10px" : "14px"}
                left={isPad() ? "20px" : "10px"}
                source={require("../../../../../images/angle-left.png")}
                style={{ zIndex: 10 }} // Here the style prop is intentionally used to avoid making zIndex too handy.
              />
            </TouchableWithoutFeedback>
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
