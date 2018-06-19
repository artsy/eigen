import React from "react"
import { Picker, PickerProperties } from "react-native"
import styled from "styled-components/native"

import { Bid } from "../types"

export interface MaxBidPickerProps extends PickerProperties {
  bids: ReadonlyArray<Bid>
}

export class MaxBidPicker extends React.Component<MaxBidPickerProps> {
  render() {
    return (
      <StyledPicker {...this.props} onValueChange={this.props.onValueChange} selectedValue={this.props.selectedValue}>
        {this.props.bids.map((bid, index) => <Picker.Item key={index} value={index} label={bid.display} />)}
      </StyledPicker>
    )
  }
}

const StyledPicker = styled.Picker`
  width: 100%;
`
