import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import BooleanSelector from "../components/boolean_button"
import * as T from "../typography"
import { Wrapper } from "./"

storiesOf("Consignments - Styling")
  .add("Type Reference", () =>
    <Wrapper>
      <T.LargeHeadline>Large Headline</T.LargeHeadline>
      <T.SmallHeadline>Small Headline</T.SmallHeadline>
      <T.Subtitle>Subtitle</T.Subtitle>
    </Wrapper>
  )
  .add("blank", () =>
    <Wrapper>
      <T.Subtitle>Subtitle</T.Subtitle>
    </Wrapper>
  )
  .add("Boolean selector", () =>
    <Wrapper>
      <BooleanSelector selected={true} left="YES" right="NO" />
      <View style={{ height: 20 }} />
      <BooleanSelector selected={false} left="IN" right="CM" />
    </Wrapper>
  )
  .add("Form of Textfields", () =>
    <Wrapper>
      <BooleanSelector selected={true} left="YES" right="NO" />
      <View style={{ height: 20 }} />
    </Wrapper>
  )
