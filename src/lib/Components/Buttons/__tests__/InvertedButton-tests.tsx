import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import { InvertedButton } from "../"
import InvertedButtonWithSpinner from "../InvertedButton"

describe("InvertedButton", () => {
  it("renders properly", () => {
    const button = renderer.create(<InvertedButton text={"I am an inverted button"} />).toJSON()
    expect(button).toMatchSnapshot()
  })

  it("accepts textStyle prop", () => {
    const textStyle = {
      fontSize: 20,
    }

    const button = renderer.create(<InvertedButton text={"I am an inverted button"} textStyle={textStyle} />).toJSON()
    expect(button).toMatchSnapshot()
  })
})

describe("InvertedButtonWithSpinner", () => {
  it("renders properly", () => {
    const button = renderer.create(<InvertedButtonWithSpinner text={"I am an inverted button"} />).toJSON()
    expect(button).toMatchSnapshot()
  })

  it("accepts textStyle prop", () => {
    const textStyle = {
      fontSize: 20,
    }

    const button = renderer
      .create(<InvertedButtonWithSpinner text={"I am an inverted button"} textStyle={textStyle} />)
      .toJSON()
    expect(button).toMatchSnapshot()
  })
})
