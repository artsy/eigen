import { storiesOf } from "@storybook/react-native"
import React from "react"
import styled from "styled-components/native"

import { Fonts } from "lib/data/fonts"
import Headline from "../Headline"
import Serif from "../Serif"

storiesOf("App Style/Typography")
  .add("App Headline", () => {
    return <Headline>This is a Blank headline</Headline>
  })
  .add("App Serif Text", () => {
    return <Serif>This is a blank serif</Serif>
  })
  .add("Typefaces", () => {
    return (
      <Container>
        <GaramondBold>AGaramondPro Bold</GaramondBold>
        <GaramondBoldItalic>AGaramondPro BoldItalic</GaramondBoldItalic>
        <GaramondItalic>AGaramondPro Italic</GaramondItalic>
        <GaramondRegular>AGaramondPro Regular</GaramondRegular>
        <GaramondSemibold>AGaramondPro Semibold</GaramondSemibold>
        <AvantGardeRegular>Avant Garde Gothic ITC</AvantGardeRegular>
        <Unita77LLItalic>Unica77LL Italic</Unita77LLItalic>
        <Unita77LLMedium>Unica77LL Medium</Unita77LLMedium>
        <Unita77LLMediumItalic>Unica77LL MediumItalic</Unita77LLMediumItalic>
        <Unita77LLRegular>Unica77LL Regular</Unita77LLRegular>
      </Container>
    )
  })

const Container = styled.View`
  margin: 70px 10px 10px;
`

const GaramondBold = styled.Text`
  font-family: "${Fonts.GaramondBold}";
  font-size: 30px;
  margin-bottom: 10px;
`

const GaramondBoldItalic = styled.Text`
  font-family: "${Fonts.GaramondBoldItalic}";
  font-size: 30px;
  margin-bottom: 10px;
`

const GaramondItalic = styled.Text`
  font-family: "${Fonts.GaramondItalic}";
  font-size: 30px;
  margin-bottom: 10px;
`

const GaramondRegular = styled.Text`
  font-family: "${Fonts.GaramondRegular}";
  font-size: 30px;
  margin-bottom: 10px;
`

const GaramondSemibold = styled.Text`
  font-family: "${Fonts.GaramondSemibold}";
  font-size: 30px;
  margin-bottom: 10px;
`

const AvantGardeRegular = styled.Text`
  font-family: "${Fonts.AvantGardeRegular}";
  font-size: 30px;
  margin-bottom: 10px;
`

const Unita77LLItalic = styled.Text`
  font-family: "${Fonts.Unica77LLItalic}";
  font-size: 30px;
  margin-bottom: 10px;
`

const Unita77LLMedium = styled.Text`
  font-family: "${Fonts.Unica77LLMedium}";
  font-size: 30px;
  margin-bottom: 10px;
`

const Unita77LLMediumItalic = styled.Text`
  font-family: "${Fonts.Unica77LLMediumItalic}";
  font-size: 30px;
  margin-bottom: 10px;
`

const Unita77LLRegular = styled.Text`
  font-family: "${Fonts.Unica77LLRegular}";
  font-size: 30px;
  margin-bottom: 10px;
`
