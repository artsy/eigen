import { storiesOf } from "@storybook/react-native"
import React from "react"
import { View } from "react-native"

import { Video } from "../Video"

storiesOf("App Style/Video")
  .addDecorator(story => <View>{story()}</View>)
  .add("Default", () => {
    return (
      <Video
        source={{
          uri: "https://d3vpvtm3t56z1n.cloudfront.net/videos/9172018-bn-banner-xl.mp4",
        }}
        size={{
          width: 515,
          height: 160,
        }}
      />
    )
  })
