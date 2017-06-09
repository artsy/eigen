import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import Toggle from "../components/toggle"
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
      <Toggle selected={true} left="YES" right="NO" />
      <View style={{ height: 20 }} />
      <Toggle selected={false} left="IN" right="CM" />
    </Wrapper>
  )
