import React from "react"
import styled from "styled-components/native"

import { Fonts } from "lib/data/fonts"

const Container = styled.View`
  flex: 1;
  height: 100%;
  margin-left: 20px;
  margin-right: 20px;
  justify-content: center;
  align-items: center;
`

const AlignUpSlightly = styled.View`
  padding-bottom: 60px;
  max-width: 320px;
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
}

const render = (props: ZeroStateProps) => (
  <Container>
    <AlignUpSlightly>
      <Title>{props.title}</Title>

      <Subtitle numberOfLines={0}>{props.subtitle}</Subtitle>
    </AlignUpSlightly>
  </Container>
)

// TODO: Remove post RN 0.50
export default class ZeroState extends React.Component<ZeroStateProps, null> {
  render() {
    return render(this.props)
  }
}
