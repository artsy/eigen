import React from "react"
import fonts from "lib/data/fonts"
import styled from "styled-components/native"

const Header = styled.View`
  padding: 10px;
  background-color: white;
`

const Title = styled.Text`
  font-family: ${fonts["garamond-regular"]};
  font-size: 25px;
  text-align: left;
  margin-left: 2px;
`

interface Props {
  section: {
    data?: any
    title?: string
  }
}

export function SectionHeader(props: Props) {
  return (
    <Header>
      <Title>
        {props.section.title}
      </Title>
    </Header>
  )
}
