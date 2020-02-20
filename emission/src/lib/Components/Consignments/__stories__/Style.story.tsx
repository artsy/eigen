import { storiesOf } from "@storybook/react-native"
import React from "react"
import { View } from "react-native"

import Text from "../Components/TextInput"
import Toggle from "../Components/Toggle"
import * as T from "../Typography"

import { Wrapper } from "./"

storiesOf("Consignments/Styling")
  .add("Type Reference", () => (
    <Wrapper>
      <T.LargeHeadline>Large Headline</T.LargeHeadline>
      <T.SmallHeadline>Small Headline</T.SmallHeadline>
      <T.Subtitle>Subtitle</T.Subtitle>
    </Wrapper>
  ))
  .add("Boolean selector", () => (
    <Wrapper>
      <Toggle selected={true} left="YES" right="NO" />
      <View style={{ height: 20 }} />
      <Toggle selected={false} left="IN" right="CM" />
    </Wrapper>
  ))
  .add("Form items", () => (
    <Wrapper>
      <View style={{ padding: 10 }}>
        <View style={{ flexDirection: "row", paddingVertical: 10 }}>
          <Text text={{ placeholder: "Hello" }} style={{ margin: 10 }} />
        </View>

        <View style={{ flexDirection: "row", paddingVertical: 6 }}>
          <Text text={{ placeholder: "Hello" }} style={{ margin: 10 }} />
          <Text text={{ placeholder: "Hello" }} style={{ margin: 10 }} />
        </View>

        <View style={{ flexDirection: "row", paddingVertical: 6 }}>
          <Text text={{ placeholder: "Hello" }} style={{ margin: 10 }} />
          <Text text={{ placeholder: "Hello" }} style={{ margin: 10 }} />
        </View>

        <View style={{ flexDirection: "row", paddingVertical: 6, alignItems: "center" }}>
          <T.BodyText style={{ paddingLeft: 10, flex: 1, textAlign: "left" }}>Is this a toggle?</T.BodyText>
          <Toggle selected={false} left="NO" right="AYE" />
        </View>
      </View>
    </Wrapper>
  ))
