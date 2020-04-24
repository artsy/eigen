import { renderWithLayout } from "lib/tests/renderWithLayout"
import React from "react"
import "react-native"

jest.mock("@react-native-community/cameraroll", () => jest.fn())

import Welcome from "../Welcome"

const devices = {
  "iPhone 4": { width: 320, height: 480 },
  "iPhone 5": { width: 320, height: 569 },
  "iPhone 6": { width: 375, height: 667 },
  "iPad in portrait mode": { width: 768, height: 1024 },
  "iPad in landscape mode": { width: 1024, height: 768 },
}

Object.keys(devices).forEach(device => {
  it(`renders without throwing an error for ${device}`, () => {
    const nav = {} as any
    const route = {} as any
    // @ts-ignore STRICTNESS_MIGRATION
    const dimensions = devices[device]

    renderWithLayout(<Welcome navigator={nav} route={route} />, dimensions)
  })
})
