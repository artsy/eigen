import { storiesOf } from "@storybook/react-native"
import React from "react"

import { ZeroState } from "../ZeroState"

storiesOf("States")
  .add("Zero State for works", () => (
    <ZeroState
      title="You’re not following any works yet"
      subtitle="When you've found a work you like, tap the heart to save it here."
    />
  ))
  .add("Zero State for artists", () => (
    <ZeroState
      title="You’re haven't followed any artists yet"
      subtitle="When you've found an artist you like, follow them to get updates on new works that become available."
    />
  ))
