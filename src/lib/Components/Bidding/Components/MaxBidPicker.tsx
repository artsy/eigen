import { Picker } from "@react-native-community/picker"
import { PickerProps } from "@react-native-community/picker/typings/Picker"
import React from "react"

import styled from "styled-components/native"

export interface MaxBidPickerProps extends PickerProps {
  bids: ReadonlyArray<{ display: string }>
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
