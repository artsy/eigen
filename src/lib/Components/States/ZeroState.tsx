import React from "react"
import styled from "styled-components/native"

import { Spacer } from "@artsy/palette"
import { Fonts } from "lib/data/fonts"

const Container = styled.View`
  flex: 1;
  height: 100%;
  margin-left: 20px;
  margin-right: 20px;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;
  padding-right: 30px;
  padding-left: 30px;
`

const Title = styled.Text`
  font-size: 30px;
  font-family: "${Fonts.GaramondRegular}";
  text-align: center;
  margin-left: 10;
  margin-right: 10;
`

const Subtitle = styled.Text`
  text-align: center;
  font-size: 18;
  font-family: "${Fonts.GaramondRegular}";
  margin-top: 10;
`

interface ZeroStateProps {
  title: string
  subtitle?: string
  separators?: boolean
  callToAction?: JSX.Element
}

export const ZeroState = (props: ZeroStateProps) => (
  <Container>
    <Title>{props.title}</Title>

    <Subtitle numberOfLines={0}>{props.subtitle}</Subtitle>
    {props.callToAction && (
      <>
        <Spacer mb={4} />
        {props.callToAction}
      </>
    )}
  </Container>
)
