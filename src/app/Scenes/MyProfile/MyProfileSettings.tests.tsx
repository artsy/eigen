import { screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { MyProfileSettings } from "./MyProfileSettings"

jest.mock("./LoggedInUserInfo")

describe(MyProfileSettings, () => {
  it("renders Edit Profile", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Edit Profile")).toBeOnTheScreen()
  })

  it("renders Account Settings", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Account Settings")).toBeOnTheScreen()
  })

  it("renders Payment", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Payment")).toBeOnTheScreen()
  })

  it("renders Push Notifications", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Push Notifications")).toBeOnTheScreen()
  })

  it("renders Send Feedback", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Send Feedback")).toBeOnTheScreen()
  })

  it("renders Personal Data Request", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Personal Data Request")).toBeOnTheScreen()
  })

  it("renders Recently Viewed", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Recently Viewed")).toBeOnTheScreen()
  })

  it("renders About", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("About")).toBeOnTheScreen()
  })

  it("renders Order history", () => {
    renderWithWrappers(<MyProfileSettings />)
    expect(screen.getByText("Order History")).toBeOnTheScreen
  })
})
