import { storiesOf } from "@kadira/react-native-storybook"
import * as React from "react"

import Overview from "../setup/overview"
import Welcome from "../setup/welcome"

const nav = {} as any
const route = {} as any

storiesOf("Consignments")
  .add("Welcome Page", () => {
    return <Welcome navigator={nav} route={route} />
  })
  .add("Overview Page", () => {
    return <Overview navigator={nav} route={route} />
  })
