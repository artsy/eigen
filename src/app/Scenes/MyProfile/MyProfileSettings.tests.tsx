import { screen } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Platform } from "react-native"
import { MyProfileSettings } from "./MyProfileSettings"

jest.mock("./LoggedInUserInfo")

describe(MyProfileSettings, () => {
  it("renders push notifications on iOS", () => {
    Platform.OS = "ios"
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Push Notifications")).toBeOnTheScreen()
  })

  it("renders push notifications on Android", () => {
    Platform.OS = "android"
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Push Notifications")).toBeOnTheScreen()
  })

  it("renders Edit Profile", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Edit Profile")).toBeOnTheScreen()
  })

  it("renders Account Settings", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Account Settings")).toBeOnTheScreen()
  })

  it("renders Alerts", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Alerts")).toBeOnTheScreen()
  })

  it("renders Follows", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Follows")).toBeOnTheScreen()
  })

  it("renders Payment", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Payment")).toBeOnTheScreen()
  })

  it("renders Send Feedback", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Send Feedback")).toBeOnTheScreen()
  })

  it("renders Personal Data Request", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Personal Data Request")).toBeOnTheScreen()
  })

  it("renders About", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("About")).toBeOnTheScreen()
  })

  it("renders Dark Mode when the ARDarkModeSupport flag is enabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ ARDarkModeSupport: true })

    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Dark Mode")).toBeOnTheScreen()
  })

  it("renders Order history", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Order History")).toBeOnTheScreen()
  })
})
