import { storiesOf } from "@kadira/react-native-storybook"
import * as React from "react"
import { RootContainer } from "react-relay"

import Info from "../setup/info"
import Welcome from "../setup/welcome"

const nav = {} as any
const route = {} as any

storiesOf("Consignments")
  .add("Welcome Page", () => {
    return <Welcome navigator={nav} route={route} />
  })
  .add("Info Page", () => {
    return <Info navigator={nav} route={route} />
  })
