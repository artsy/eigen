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
      "AGaramondPro Bold": Fonts.GaramondBold,
      "AGaramondPro BoldItalic": Fonts.GaramondBoldItalic,
      "AGaramondPro Italic": Fonts.GaramondItalic,
      "AGaramondPro Regular": Fonts.GaramondRegular,
      "AGaramondPro Semibold": Fonts.GaramondSemibold,
      "Avant Garde Gothic ITC": Fonts.AvantGardeRegular,
      "Unica77LL Italic": Fonts.Unica77LLItalic,
      "Unica77LL Medium": Fonts.Unica77LLMedium,
      "Unica77LL MediumItalic": Fonts.Unica77LLMediumItalic,
      "Unica77LL Regular": Fonts.Unica77LLRegular,
    }
    return (
      <Container>
        <Separator />
        {Object.entries(fonts).map(value => {
          const [name, font] = value
          const Component = styled.Text`
            font-family: "${font}";
            font-size: 30px;
            margin-bottom: 10px;
          `

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
