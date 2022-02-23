import React from "react"
import { ViewProps } from "react-native"
import styled from "styled-components/native"

const Header = styled.View`
  padding: 10px;
  padding-top: 25px;
  padding-bottom: 0;
  margin-bottom: -4px;
  background-color: white;
`

const Title = styled.Text`
  font-family: "ReactNativeAGaramondPro-Regular";
  font-size: 30px;
  text-align: left;
`

interface Props extends ViewProps {
  title: string
}

export const SectionHeader: React.FC<Props> = (props) => {
  return (
    <Header style={props.style}>
      <Title>{props.title}</Title>
    </Header>
  )
}
