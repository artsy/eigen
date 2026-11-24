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

  it("renders Transactions section", async () => {
    await renderWithWrappers(<MyProfileSettings />)

    expect(screen.getByText("Transactions")).toBeOnTheScreen()

    const transactions = screen.getByText("Your Orders")
    expect(transactions).toBeOnTheScreen()
    await fireEvent.press(transactions)
    expect(navigate).toHaveBeenCalledWith("/orders")
  })

  it("renders Preferences section", async () => {
    await renderWithWrappers(<MyProfileSettings />)

    expect(screen.getByText("Preferences")).toBeOnTheScreen()

    const priceRange = screen.getByText("Artwork Budget")
    expect(priceRange).toBeOnTheScreen()
    await fireEvent.press(priceRange)
    expect(navigate).toHaveBeenCalledWith("/my-account/edit-price-range")

    const darkMode = screen.getByText("Dark Mode")
    expect(darkMode).toBeOnTheScreen()
    await fireEvent.press(darkMode)
    expect(navigate).toHaveBeenCalledWith("/my-account/dark-mode")
  })

  it("renders Account section", async () => {
    await renderWithWrappers(<MyProfileSettings />)

    expect(screen.getAllByText("Account")).toHaveLength(2)

    const loginAndSecurity = screen.getByText("Login and Security")
    expect(loginAndSecurity).toBeOnTheScreen()
    await fireEvent.press(loginAndSecurity)
    expect(navigate).toHaveBeenCalledWith("my-account")

    const payments = screen.getByText("Payments")
    expect(payments).toBeOnTheScreen()
    await fireEvent.press(payments)
    expect(navigate).toHaveBeenCalledWith("my-profile/payment")

    const notifications = screen.getByText("Notifications")
    expect(notifications).toBeOnTheScreen()
    await fireEvent.press(notifications)
    expect(navigate).toHaveBeenCalledWith("my-profile/push-notifications")
  })

  it("renders Support section", async () => {
    await renderWithWrappers(<MyProfileSettings />)

    expect(screen.getByText("Support")).toBeOnTheScreen()

    const helpCenter = screen.getByText("Help Center")
    expect(helpCenter).toBeOnTheScreen()
    await fireEvent.press(helpCenter)
    expect(navigate).toHaveBeenCalledWith("https://support.artsy.net/")

    const sendFeedback = screen.getByText("Send Feedback")
    expect(sendFeedback).toBeOnTheScreen()
    await fireEvent.press(sendFeedback)
    expect(Linking.openURL).toHaveBeenCalledWith(
      expect.stringMatching(
        /^mailto:support@artsy.net\?subject=Feedback%20from%20the%20Artsy%20app*$/
      )
    )
  })

  it("renders Legal section", async () => {
    await renderWithWrappers(<MyProfileSettings />)

    expect(screen.getByText("Legal")).toBeOnTheScreen()

    const termsAndConditions = screen.getByText("Terms and Conditions")
    expect(termsAndConditions).toBeOnTheScreen()
    await fireEvent.press(termsAndConditions)
    expect(navigate).toHaveBeenCalledWith("my-profile/terms-and-conditions")

    const privacy = screen.getByText("Privacy")
    expect(privacy).toBeOnTheScreen()
    await fireEvent.press(privacy)
    expect(navigate).toHaveBeenCalledWith("my-profile/privacy")
  })

  it("renders Log out", async () => {
    await renderWithWrappers(<MyProfileSettings />)

    const logOut = screen.getByText("Log out")

    expect(logOut).toBeOnTheScreen()
    await fireEvent.press(logOut)
    expect(Alert.alert).toHaveBeenCalled()
  })

  /* it("renders version number", () => {
      renderWithWrappers(<MyProfileSettings />)

      const version = screen.getByText("Version 2.0.0")

      expect(version).toBeOnTheScreen()
    }) */
})
