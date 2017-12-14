import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { ZeroState } from "../index"

jest.mock("WebView", () => "WebView")
jest.mock("../index.html", () => "")

it("looks correct when rendered", () => {
  const auctions = renderer.create(<ZeroState />)
  expect(auctions).toMatchSnapshot()
})
