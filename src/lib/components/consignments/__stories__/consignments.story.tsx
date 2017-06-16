import { storiesOf } from "@storybook/react-native"
import * as React from "react"

import Nav from "../index"
import Artist from "../screens/artist"
import Overview from "../screens/overview"
import Welcome from "../screens/welcome"

const nav = {} as any
const route = {} as any

storiesOf("Consignments")
  .add("Full Nav", () => {
    return <Nav />
  })
  .add("Welcome Page", () => {
    return <Welcome navigator={nav} route={route} />
  })
  .add("Overview Page", () => {
    return <Overview navigator={nav} route={route} setup={{}} />
  })
  .add("Artist Page", () => {
    return <Artist navigator={nav} route={route} />
  })
