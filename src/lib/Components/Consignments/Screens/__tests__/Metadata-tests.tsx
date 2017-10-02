import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { ConsignmentMetadata } from "../../index"
import Metadata from "../Metadata"

const nav = {} as any
const route = {} as any

const exampleMetadata: ConsignmentMetadata = {
  title: "My Work",
  year: "1983",
  category: "Design",
  medium: "Wood",
  width: "100",
  height: "100",
  depth: null,
  unit: "cm",
  displayString: "5/5",
}

describe("state", () => {
  it("is set up with empty consignment metadata", () => {
    const consignmentMetadata = {} as ConsignmentMetadata
    const tree = renderer.create(<Metadata navigator={nav} route={route} metadata={consignmentMetadata} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it("is set up with filled consignment metadata", () => {
    const tree = renderer.create(<Metadata navigator={nav} route={route} metadata={exampleMetadata} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it("sets state correctly at init", () => {
    const metadata: ConsignmentMetadata = {
      title: "My Work",
      year: "1983",
      category: "Design",
      medium: "Wood",
      width: "100",
      height: "100",
      depth: null,
      unit: "cm",
      displayString: "5/5",
    }

    const m = new Metadata({ metadata: exampleMetadata })
    expect(m.state).toEqual(metadata)
  })
})
