import React from "react"
import { TextProperties } from "react-native"
import styled from "styled-components/native"

import { Fonts } from "../../../data/fonts"

export class Title extends React.Component<TextProperties> {
  render() {
    return <StyledText {...this.props}>{this.props.children}</StyledText>
  }
}

const StyledText = styled.Text`
  font-family: "${Fonts.GaramondRegular}";
  margin: 10px;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
`
