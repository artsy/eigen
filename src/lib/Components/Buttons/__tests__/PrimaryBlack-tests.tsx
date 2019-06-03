import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import PrimaryBlack from "../PrimaryBlack"

import { Theme } from "@artsy/palette"

describe("PrimaryBlack", () => {
  it("renders properly", () => {
    const button = renderer
      .create(
        <Theme>
          <PrimaryBlack text={"I am a shiny new  button"} />
        </Theme>
      )
      .toJSON()
    expect(button).toMatchSnapshot()
  })

  it("accepts textStyle prop", () => {
    const textStyle = {
      fontSize: 22,
    }

    const button = renderer
      .create(
        <Theme>
          <PrimaryBlack text={"I am a shiny new button"} textStyle={textStyle} />
        </Theme>
      )
      .toJSON()
    expect(button).toMatchSnapshot()
  })
})
