import React from "react"
import { Picker, PickerProperties } from "react-native"
import styled from "styled-components/native"

interface Bid {
  label: string
  value: number
}

export interface MaxBidPickerProps extends PickerProperties {
  bids: Bid[]
  selectedBidIndex: number
  onSelectNewBidIndex: (number) => void
}

export class MaxBidPicker extends React.Component<MaxBidPickerProps> {
  render() {
    return (
      <StyledPicker
        {...this.props}
        onValueChange={(_, index) => this.props.onSelectNewBidIndex(index)}
        selectedValue={this.props.selectedBidIndex}
      >
        {this.props.bids.map((bid, index) => <Picker.Item key={index} value={index} label={bid.label} />)}
      </StyledPicker>
    )
  }
}

const StyledPicker = styled.Picker`
  width: 100%;
`
