import { storiesOf } from "@storybook/react-native"
import React from "react"
import styled from "styled-components/native"

import Separator from "lib/Components/Separator"
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
    const fonts = {
      "AGaramondPro Bold": GaramondBold,
      "AGaramondPro BoldItalic": GaramondBoldItalic,
      "AGaramondPro Italic": GaramondItalic,
      "AGaramondPro Regular": GaramondRegular,
      "AGaramondPro Semibold": GaramondSemibold,
      "Avant Garde Gothic ITC": AvantGardeRegular,
      "Unica77LL Italic": Unita77LLItalic,
      "Unica77LL Medium": Unita77LLMedium,
      "Unica77LL MediumItalic": Unita77LLMediumItalic,
      "Unica77LL Regular": Unita77LLRegular,
    }
    return (
      <Container>
        <Separator />
        {Object.entries(fonts).map(value => {
          const [name, Component] = value
          return (
            <React.Fragment key={name}>
              <Component>{name}</Component>
              <Separator />
            </React.Fragment>
          )
        })}
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
