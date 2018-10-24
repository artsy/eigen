import { storiesOf } from "@storybook/react-native"
import React from "react"

import Show from "../"

storiesOf("Show/Relay").add("Root", () => <Show show={{ name: "This is a stubbed show" } as any} />)
