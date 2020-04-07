import React from "react"
import { ViewProperties } from "react-native"
import styled from "styled-components/native"

import fonts from "lib/data/fonts"

const Header = styled.View`
  padding: 10px;
  padding-top: 25px;
  padding-bottom: 0;
  margin-bottom: -4px;
  background-color: white;
`

const Title = styled.Text`
  font-family: ${fonts["garamond-regular"]};
  font-size: 30px;
  text-align: left;
`

interface Props extends ViewProperties {
  title: string
}

export const SectionHeader: React.SFC<Props> = props => {
  return (
    <Header style={props.style}>
      <Title>{props.title}</Title>
    </Header>
  )
}
