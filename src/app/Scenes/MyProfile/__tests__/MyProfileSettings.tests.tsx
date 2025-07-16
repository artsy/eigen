import { fireEvent, screen } from "@testing-library/react-native"
import { MyProfileSettings } from "app/Scenes/MyProfile/MyProfileSettings"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Alert, Linking } from "react-native"

jest.mock("../LoggedInUserInfo")
jest.spyOn(Alert, "alert")

describe("MyProfileSettings", () => {
  beforeEach(() => {
    jest.spyOn(Linking, "openURL").mockImplementation(() => Promise.resolve())
  })

  it("renders Transactions section", () => {
    renderWithWrappers(<MyProfileSettings />)

    expect(screen.getByText("Transactions")).toBeOnTheScreen()

    const transactions = screen.getByText("Your Orders")
    expect(transactions).toBeOnTheScreen()
    fireEvent.press(transactions)
    expect(navigate).toHaveBeenCalledWith("/orders")
  })

  it("renders Preferences section", () => {
    renderWithWrappers(<MyProfileSettings />)

    expect(screen.getByText("Preferences")).toBeOnTheScreen()

    const priceRange = screen.getByText("Price Range")
    expect(priceRange).toBeOnTheScreen()
    fireEvent.press(priceRange)
    expect(navigate).toHaveBeenCalledWith("/my-account/edit-price-range")

    const darkMode = screen.getByText("Dark Mode")
    expect(darkMode).toBeOnTheScreen()
    fireEvent.press(darkMode)
    expect(navigate).toHaveBeenCalledWith("/my-account/dark-mode")
  })

  it("renders Account section", () => {
    renderWithWrappers(<MyProfileSettings />)

    expect(screen.getAllByText("Account")).toHaveLength(2)

    const loginAndSecurity = screen.getByText("Login and Security")
    expect(loginAndSecurity).toBeOnTheScreen()
    fireEvent.press(loginAndSecurity)
    expect(navigate).toHaveBeenCalledWith("my-account")

    const payments = screen.getByText("Payments")
    expect(payments).toBeOnTheScreen()
    fireEvent.press(payments)
    expect(navigate).toHaveBeenCalledWith("my-profile/payment")

    const notifications = screen.getByText("Notifications")
    expect(notifications).toBeOnTheScreen()
    fireEvent.press(notifications)
    expect(navigate).toHaveBeenCalledWith("my-profile/push-notifications")
  })

  it("renders Support section", () => {
    renderWithWrappers(<MyProfileSettings />)

    expect(screen.getByText("Support")).toBeOnTheScreen()

    const helpCenter = screen.getByText("Help Center")
    expect(helpCenter).toBeOnTheScreen()
    fireEvent.press(helpCenter)
    expect(navigate).toHaveBeenCalledWith("https://support.artsy.net/")

    const sendFeedback = screen.getByText("Send Feedback")
    expect(sendFeedback).toBeOnTheScreen()
    fireEvent.press(sendFeedback)
    expect(Linking.openURL).toHaveBeenCalledWith(
      expect.stringMatching(
        /^mailto:support@artsy.net\?subject=Feedback%20from%20the%20Artsy%20app*$/
      )
    )
  })

  it("renders Legal section", () => {
    renderWithWrappers(<MyProfileSettings />)

    expect(screen.getByText("Legal")).toBeOnTheScreen()

    const termsAndConditions = screen.getByText("Terms and Conditions")
    expect(termsAndConditions).toBeOnTheScreen()
    fireEvent.press(termsAndConditions)
    expect(navigate).toHaveBeenCalledWith("my-profile/terms-and-conditions")

    const privacy = screen.getByText("Privacy")
    expect(privacy).toBeOnTheScreen()
    fireEvent.press(privacy)
    expect(navigate).toHaveBeenCalledWith("my-profile/privacy")
  })

  it("renders Log out", () => {
    renderWithWrappers(<MyProfileSettings />)

    const logOut = screen.getByText("Log out")

    expect(logOut).toBeOnTheScreen()
    fireEvent.press(logOut)
    expect(Alert.alert).toHaveBeenCalled()
  })

  /* it("renders version number", () => {
      renderWithWrappers(<MyProfileSettings />)

      const version = screen.getByText("Version 2.0.0")

      expect(version).toBeOnTheScreen()
    }) */
})
