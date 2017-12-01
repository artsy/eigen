import fonts from "lib/data/fonts"
import React from "react"
import styled from "styled-components/native"

const Header = styled.View`
  padding: 10px;
  padding-top: 20px;
  background-color: white;
`

const Title = styled.Text`
  font-family: ${fonts["garamond-regular"]};
  font-size: 25px;
  text-align: left;
`

interface Props {
  title: string
}

export function SectionHeader(props: Props) {
  return (
    <Header>
      <Title>
        {props.title}
      </Title>
    </Header>
  )
}
