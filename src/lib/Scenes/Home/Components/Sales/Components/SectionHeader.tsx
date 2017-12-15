import React from "react"
import styled from "styled-components/native"

import fonts from "lib/data/fonts"

const Header = styled.View`
  padding: 10px;
  padding-top: 18px;
  background-color: white;
`

const Title = styled.Text`
  font-family: ${fonts["garamond-regular"]};
  font-size: 30px;
  text-align: left;
`

interface Props {
  title: string
}

export const SectionHeader: React.SFC<Props> = props => {
  return (
    <Header>
      <Title>{props.title}</Title>
    </Header>
  )
}
