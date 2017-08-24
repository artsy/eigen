import { storiesOf } from "@storybook/react-native"
import * as React from "react"

import Nav from "../index"
import Artist from "../Screens/Artist"
import FinalSubmissionQuestions from "../Screens/FinalSubmissionQuestions"
import Location from "../Screens/Location"
import Overview from "../Screens/Overview"
import Provenance from "../Screens/Provenance"
import SelectFromPhotoLibrary from "../Screens/SelectFromPhotoLibrary"
import Welcome from "../Screens/Welcome"

const nav = {} as any
const route = {} as any

storiesOf("Consignments/_Screens")
  .add("Consignments", () => {
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
  .add("Provenance", () => {
    return <Provenance navigator={nav} route={route} />
  })
  .add("SelectFromPhotoLibrary Page", () => {
    return <SelectFromPhotoLibrary navigator={nav} route={route} />
  })
  .add("Location Page", () => {
    return <Location navigator={nav} route={route} />
  })
  .add("FinalSubmissionQuestions Page", () => {
    return <FinalSubmissionQuestions navigator={nav} route={route} setup={{}} />
  })
