import { mockNavigate } from "app/utils/tests/navigationMocks"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Platform } from "react-native"

jest.mock("@react-navigation/native")

jest.mock("react-native/Libraries/Interaction/InteractionManager", () => ({
  ...jest.requireActual("react-native/Libraries/Interaction/InteractionManager"),
  runAfterInteractions: jest.fn((callback) => callback()),
}))

describe("OnboardingSocialPick", () => {
  const { OnboardingSocialPick } = require("app/Scenes/Onboarding/OnboardingSocialPick")
  const { GlobalStore } = require("app/store/GlobalStore")

  describe("login", () => {
    afterAll(() => {
      jest.clearAllMocks()
    })
    it("navigates to log in with email when the user presses on continue with email", () => {
      const tree = renderWithWrappersLEGACY(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "continueWithEmail" }).props.onPress()
      expect(mockNavigate).toHaveBeenCalledWith("OnboardingLoginWithEmail")
    })

    it("logs in using facebook when the user presses on continue with facebook", async () => {
      GlobalStore.actions.auth.authFacebook = jest.fn(() =>
        Promise.resolve({ success: true })
      ) as any
      const tree = renderWithWrappersLEGACY(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "continueWithFacebook" }).props.onPress()
      expect(GlobalStore.actions.auth.authFacebook).toHaveBeenCalled()
    })

    it("logs in using google when the user presses on continue with google", async () => {
      GlobalStore.actions.auth.authGoogle = jest.fn(() => Promise.resolve({ success: true })) as any
      const tree = renderWithWrappersLEGACY(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "continueWithGoogle" }).props.onPress()
      expect(GlobalStore.actions.auth.authGoogle).toHaveBeenCalled()
    })

    it("logs in using apple when the user presses on continue with apple", () => {
      Platform.OS = "ios"
      Object.defineProperty(Platform, "Version", {
        get: () => 14,
      })
      GlobalStore.actions.auth.authApple = jest.fn(() => Promise.resolve({ success: true })) as any
      const tree = renderWithWrappersLEGACY(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "continueWithApple" }).props.onPress()
      expect(GlobalStore.actions.auth.authApple).toHaveBeenCalled()
    })
  })

  describe("sign up", () => {
    afterAll(() => {
      jest.clearAllMocks()
    })
    it("navigates to sign up with email when the user presses on continue with email", () => {
      const tree = renderWithWrappersLEGACY(<OnboardingSocialPick mode="signup" />)
      tree.root.findByProps({ testID: "continueWithEmail" }).props.onPress()
      expect(mockNavigate).toHaveBeenCalledWith("OnboardingCreateAccountWithEmail")
    })

    it("signs up using facebook when the user presses on continue with facebook", async () => {
      GlobalStore.actions.auth.authFacebook = jest.fn(() =>
        Promise.resolve({ success: true })
      ) as any

      const tree = renderWithWrappersLEGACY(<OnboardingSocialPick mode="signup" />)
      tree.root.findByProps({ testID: "continueWithFacebook" }).props.onPress()
      expect(GlobalStore.actions.auth.authFacebook).toHaveBeenCalled()
    })

    it("signs up using google when the user presses on continue with google", async () => {
      GlobalStore.actions.auth.authGoogle = jest.fn(() => Promise.resolve({ success: true })) as any

      const tree = renderWithWrappersLEGACY(<OnboardingSocialPick mode="signup" />)
      tree.root.findByProps({ testID: "continueWithGoogle" }).props.onPress()
      expect(GlobalStore.actions.auth.authGoogle).toHaveBeenCalled()
    })

    it("signs up in using apple when the user presses on continue with apple", () => {
      Platform.OS = "ios"
      Object.defineProperty(Platform, "Version", {
        get: () => 14,
      })
      GlobalStore.actions.auth.authApple = jest.fn(() => Promise.resolve({ success: true })) as any
      const tree = renderWithWrappersLEGACY(<OnboardingSocialPick mode="signup" />)
      tree.root.findByProps({ testID: "continueWithApple" }).props.onPress()
      expect(GlobalStore.actions.auth.authApple).toHaveBeenCalled()
    })
  })
})

describe("webView links ", () => {
  const { OnboardingSocialPick } = require("app/Scenes/Onboarding/OnboardingSocialPick")

  it("opens terms webView", () => {
    const tree = renderWithWrappersLEGACY(<OnboardingSocialPick mode="login" />)
    tree.root.findByProps({ testID: "openTerms" }).props.onPress()
    expect(mockNavigate).toHaveBeenCalledWith("OnboardingWebView", { url: "/terms" })
  })

  it("opens privacy webView", () => {
    const tree = renderWithWrappersLEGACY(<OnboardingSocialPick mode="login" />)
    tree.root.findByProps({ testID: "openPrivacy" }).props.onPress()
    expect(mockNavigate).toHaveBeenCalledWith("OnboardingWebView", { url: "/privacy" })
  })
})
