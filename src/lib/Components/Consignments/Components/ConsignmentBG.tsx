import * as React from "react"

import { Image, View, ViewStyle } from "react-native"

import styled from "styled-components/native"

// Full screen black
const BG = styled.View`
  background-color: black;
  flex: 1;
`

// Centered max-width of 600px
const ConsignmentBG = styled.View`
  background-color: black;
  max-width: 540px;
  width: 100%;
  height: 100%;
  align-self: center;
`

export default ({ children }: any) =>
  <BG key="bg">
    <ConsignmentBG>
      {children}
    </ConsignmentBG>
  </BG>
