import React from "react"
import { NavigatorIOS, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { Button } from "../Components/Button"
import { Container } from "../Components/Container"
import { Margins } from "../Components/Margins"
import { MaxBidPicker } from "../Components/MaxBidPicker"
import { Title } from "../Components/Title"
import { ConfirmBidScreen } from "./ConfirmBid"

import { SelectMaxBid_sale_artwork } from "__generated__/SelectMaxBid_sale_artwork.graphql"

interface SelectMaxBidProps extends ViewProperties {
  sale_artwork: SelectMaxBid_sale_artwork
  navigator: NavigatorIOS
}

interface SelectMaxBidState {
  selectedBidIndex: number
}

export class SelectMaxBid extends React.Component<SelectMaxBidProps, SelectMaxBidState> {
  state = {
    selectedBidIndex: 0,
  }

  onPressNext = () => {
    const component = null // <ConfirmBid saleArtworkID={this.props.sale_artwork} />
    this.props.navigator.push({
      component,
      title: "",
      passProps: {},
    })
  }

  render() {
    // TODO metaphysics should return formatted values
    const bids =
      (this.props.sale_artwork &&
        this.props.sale_artwork.increments &&
        this.props.sale_artwork.increments.map(i => ({ label: i.display, value: i.cents }))) ||
      []
    return (
      <Container>
        <Title style={Margins.m1}>Your max bid</Title>

        <MaxBidPicker
          bids={bids}
          selectedBidIndex={this.state.selectedBidIndex}
          onSelectNewBidIndex={index => this.setState({ selectedBidIndex: index })}
        />

        <Button text="NEXT" onPress={this.onPressNext} />
      </Container>
    )
  }
}

export const MaxBidScreen = createFragmentContainer(
  SelectMaxBid,
  graphql`
    fragment SelectMaxBid_sale_artwork on SaleArtwork {
      increments {
        display
        cents
      }
    }
  `
)
