import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import { InvertedButton } from "../"
import InvertedButtonWithSpinner from "../InvertedButton"

import { Theme } from "@artsy/palette"

describe("InvertedButton", () => {
  it("renders properly", () => {
    const button = renderer
      .create(
        <Theme>
          <InvertedButton text={"I am an inverted button"} />
        </Theme>
      )
      .toJSON()
    expect(button).toMatchSnapshot()
  })

  it("accepts textStyle prop", () => {
    const textStyle = {
      fontSize: 20,
    }

    const button = renderer
      .create(
        <Theme>
          <InvertedButton text={"I am an inverted button"} textStyle={textStyle} />
        </Theme>
      )
      .toJSON()
    expect(button).toMatchSnapshot()
  })
})

describe("InvertedButtonWithSpinner", () => {
  it("renders properly", () => {
    const button = renderer
      .create(
        <Theme>
          <InvertedButtonWithSpinner text={"I am an inverted button"} />
        </Theme>
      )
      .toJSON()
    expect(button).toMatchSnapshot()
  })

  it("accepts textStyle prop", () => {
    const textStyle = {
      fontSize: 20,
    }

    const button = renderer
      .create(
        <Theme>
          <InvertedButtonWithSpinner text={"I am an inverted button"} textStyle={textStyle} />
        </Theme>
      )
      .toJSON()
    expect(button).toMatchSnapshot()
  })
})
