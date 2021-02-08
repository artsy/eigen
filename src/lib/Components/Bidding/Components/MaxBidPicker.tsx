import { Picker } from "@react-native-community/picker"
import React from "react"

import styled from "styled-components/native"

export interface MaxBidPickerProps {
  bids: ReadonlyArray<{ display: string }>
  onValueChange: (itemValue: any, itemPosition: number) => void
  selectedValue: string | number
}

export const MaxBidPicker: React.FC<MaxBidPickerProps> = ({ bids, onValueChange, selectedValue, ...rest }) => (
  <StyledPicker {...rest} onValueChange={onValueChange} selectedValue={selectedValue}>
    {bids.map((bid, index) => (
      <Picker.Item key={index} value={index} label={bid.display} />
    ))}
  </StyledPicker>
)

const StyledPicker = styled.Picker`
  width: 100%;
`
