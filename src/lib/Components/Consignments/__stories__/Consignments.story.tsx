import { storiesOf } from "@storybook/react-native"
import * as React from "react"

import Nav from "../index"
import Artist from "../Screens/Artist"
import FinalSubmissionQuestions from "../Screens/FinalSubmissionQuestions"

import Location from "../Screens/Location"
import Metadata from "../Screens/Metadata"
import Overview from "../Screens/Overview"
import Provenance from "../Screens/Provenance"
import SelectFromPhotoLibrary from "../Screens/SelectFromPhotoLibrary"
import Welcome from "../Screens/Welcome"

const nav = {} as any
const route = {} as any

const blankMetadata = {
  title: null,
  year: null,
  category: null,
  categoryName: null,
  medium: null,
  width: null,
  height: null,
  depth: null,
  unit: "in",
  displayString: null,
}

storiesOf("Consignments/_Screens")
  .add("Consignments", () => <Nav />)
  .add("Welcome Page", () => <Welcome navigator={nav} route={route} />)
  .add("Overview Page (Fresh)", () => <Overview navigator={nav} route={route} setup={{}} />)
  .add("Overview Page", () => <Overview navigator={nav} route={route} setup={null} />)
  .add("Artist Page", () => <Artist navigator={nav} route={route} />)
  .add("SelectFromPhotoLibrary Page", () => <SelectFromPhotoLibrary navigator={nav} route={route} setup={{}} />)
  .add("Location Page", () => <Location navigator={nav} route={route} />)
  .add("Metadata Page", () => <Metadata navigator={nav} route={route} metadata={blankMetadata} />)
  .add("Provenance", () => <Provenance navigator={nav} route={route} />)
  .add("FinalSubmissionQuestions Page", () =>
    <FinalSubmissionQuestions navigator={nav} route={route} setup={{}} submitFinalSubmission={() => ""} />
  )
