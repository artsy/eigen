import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import * as T from "../typography"

import BooleanSelector from "../components/boolean_button"

const Wrapper = p => <View style={{ backgroundColor: "black", flex: 1, paddingTop: 20 }}>{p.children}</View>

storiesOf("Consignments - Type")
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
      <BooleanSelector selected={true} />
      <BooleanSelector selected={false} />
    </Wrapper>
  )
