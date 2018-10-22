import { storiesOf } from "@storybook/react-native"
import React from "react"

import Fair from "../"

storiesOf("Fair/Relay").add("Root", () => <Fair fair={{ name: "This is a stubbed fair" } as any} />)
