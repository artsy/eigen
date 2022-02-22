import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { Platform } from "react-native"
import { MyProfileSettings } from "./MyProfileSettings"

jest.mock("./LoggedInUserInfo")
jest.unmock("react-relay")

describe(MyProfileSettings, () => {
  const getWrapper = () => {
    const tree = renderWithWrappers(<MyProfileSettings />)
    return tree
  }

  it("renders without throwing an error", () => {
    getWrapper()
  })

  it("renders push notifications on iOS", () => {
    Platform.OS = "ios"
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Push Notifications")
  })

  it("renders push notifications on Android", () => {
    Platform.OS = "android"
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Push Notifications")
  })

  it("renders Saved Alerts", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Saved Alerts")
  })

  it("renders Orders when the AREnableOrderHistoryOption flag is enabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableOrderHistoryOption: true })

    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Order History")
  })

  it("renders Addresses when the AREnableSavedAddresses flag is enabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedAddresses: true })

    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Saved Addresses")
  })
})
