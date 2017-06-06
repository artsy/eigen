import * as React from "react"
import { View } from "react-native"

import { storiesOf } from "@storybook/react-native"

import BooleanSelector from "../components/boolean_button"

const Wrapper = (p) => <View style={{backgroundColor: "black", flex: 1, paddingTop: 20}}>{p.children}</View>

storiesOf("Consignments - Form Elements")
  .add("Boolean selector", () =>
    <Wrapper>
      <BooleanSelector selected={true}/>
      <BooleanSelector selected={false}/>
    </Wrapper>,
  )
