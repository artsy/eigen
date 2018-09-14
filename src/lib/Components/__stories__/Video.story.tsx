import { storiesOf } from "@storybook/react-native"
import React from "react"
import { View } from "react-native"

import { Video } from "../Video"

storiesOf("App Style/Video")
  .addDecorator(story => <View>{story()}</View>)
  .add("Default", () => {
    return <Video />
  })
