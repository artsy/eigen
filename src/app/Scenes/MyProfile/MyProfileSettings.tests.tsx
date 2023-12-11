import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Platform } from "react-native"
import { MyProfileSettings } from "./MyProfileSettings"

jest.mock("./LoggedInUserInfo")

describe(MyProfileSettings, () => {
  const getWrapper = () => {
    const tree = renderWithWrappersLEGACY(<MyProfileSettings />)
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

  it("renders Edit Profile", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Edit Profile")
  })

  it("renders Account Settings", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Account Settings")
  })

  it("renders Alerts", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Alerts")
  })

  it("renders Follows", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Follows")
  })

  it("renders Payment", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Payment")
  })

  it("renders Send Feedback", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Send Feedback")
  })

  it("renders Personal Data Request", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Personal Data Request")
  })

  it("renders About", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("About")
  })

  it("renders Dark Mode when the ARDarkModeSupport flag is enabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ ARDarkModeSupport: true })

    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Dark Mode")
  })

  it("renders Order history", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Order History")
  })
})
