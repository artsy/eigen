import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { ZeroState } from "../index"

import { Theme } from "@artsy/palette"

jest.mock("WebView", () => "WebView")
jest.mock("../index.html", () => "")

it("looks correct when rendered", () => {
  const auctions = renderer.create(
    <Theme>
      <ZeroState />
    </Theme>
  )
  expect(auctions).toMatchSnapshot()
})

describe("webview redirects", () => {
  it("should take over clicks", () => {
    const z = new ZeroState(null)
    const clickEvent: any = {
      navigationType: "click",
    }
    expect(z.shouldLoadRequest(clickEvent)).toBeFalsy()
  })

  it("should ignore redirects etc", () => {
    const z = new ZeroState(null)
    const redirectEvent: any = {
      navigationType: "redirect",
    }
    expect(z.shouldLoadRequest(redirectEvent)).toBeTruthy()
  })
})
