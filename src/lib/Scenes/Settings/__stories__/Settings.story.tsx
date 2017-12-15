import { storiesOf } from "@storybook/react-native"
import React from "react"

import Containers from "lib/Containers"
import { MyProfileRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"

storiesOf("Settings/My Account").add("Your user profile", () => (
  <MyProfileRenderer render={renderWithLoadProgress(Containers.MyProfile)} />
))
