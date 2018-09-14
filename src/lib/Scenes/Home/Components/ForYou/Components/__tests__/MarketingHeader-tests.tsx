import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { MarketingHeader } from "../MarketingHeader"

describe("MarketingHeader", () => {
  it("looks correct when rendered", () => {
    const tree = renderer.create(<MarketingHeader />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
