import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import PrimaryBlack from "../PrimaryBlack"

describe("PrimaryBlack", () => {
  it("renders properly", () => {
    const button = renderer.create(<PrimaryBlack text={"I am a shiny new  button"} />).toJSON()
    expect(button).toMatchSnapshot()
  })

  it("accepts textStyle prop", () => {
    const textStyle = {
      fontSize: 22,
    }

    const button = renderer.create(<PrimaryBlack text={"I am a shiny new button"} textStyle={textStyle} />).toJSON()
    expect(button).toMatchSnapshot()
  })
})
