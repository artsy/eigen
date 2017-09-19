import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { ConsignmentMetadata } from "../../index"
import Metadata from "../Metadata"

const nav = {} as any
const route = {} as any

describe("state", () => {
  it("is set up with empty consignment metadata", () => {
    const consignmentMetadata = {} as ConsignmentMetadata
    const tree = renderer.create(<Metadata navigator={nav} route={route} metadata={consignmentMetadata} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it("is set up with filled consignment metadata", () => {
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
    const tree = renderer.create(<Metadata navigator={nav} route={route} metadata={metadata} />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
