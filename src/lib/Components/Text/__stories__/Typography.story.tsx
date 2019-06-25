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
    const fonts = [
      { name: "AGaramondPro Bold", family: Fonts.GaramondBold },
      { name: "AGaramondPro BoldItalic", family: Fonts.GaramondBoldItalic },
      { name: "AGaramondPro Italic", family: Fonts.GaramondItalic },
      { name: "AGaramondPro Regular", family: Fonts.GaramondRegular },
      { name: "AGaramondPro Semibold", family: Fonts.GaramondSemibold },
      { name: "Avant Garde Gothic ITC", family: Fonts.AvantGardeRegular },
      { name: "Unica77LL Italic", family: Fonts.Unica77LLItalic },
      { name: "Unica77LL Medium", family: Fonts.Unica77LLMedium },
      { name: "Unica77LL MediumItalic", family: Fonts.Unica77LLMediumItalic },
      { name: "Unica77LL Regular", family: Fonts.Unica77LLRegular },
    ]
    const fontComponents = fonts.map(({ name, family }) => {
      const Component = styled.Text`
        font-family: "${family}";
        font-size: 30px;
        margin-bottom: 10px;
      `
      return <Component key={name}>{name}</Component>
    })
    const separatedComponents = fontComponents.reduce(
      (memo, component, index) => [memo, <Separator key={index} />, component] as any // TypeScript doesn't know that JSX Elements can be arrays.
    )
    return (
      <Container>
        <Separator />
        {separatedComponents}
      </Container>
    )
  })

const Container = styled.View`
  margin: 70px 10px 10px;
`
