import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { mockNavigate } from "app/tests/navigationMocks"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { OnboardingSocialPick } from "../OnboardingSocialPick"

jest.mock("@react-navigation/native")

describe("OnboardingSocialPick", () => {
  describe("login", () => {
    afterAll(() => {
      jest.clearAllMocks()
    })
    it("navigates to log in with email when the user presses on continue with email", () => {
      const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "continueWithEmail" }).props.onPress()
      expect(mockNavigate).toHaveBeenCalledWith("OnboardingLoginWithEmail")
    })

    it("logs in using facebook when the user presses on continue with facebook", async () => {
      GlobalStore.actions.auth.authFacebook = jest.fn(() =>
        Promise.resolve({ success: true })
      ) as any
      const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "continueWithFacebook" }).props.onPress()
      expect(GlobalStore.actions.auth.authFacebook).toHaveBeenCalled()
    })

    it("logs in using google when the user presses on continue with google", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ ARGoogleAuth: true })
      GlobalStore.actions.auth.authGoogle = jest.fn(() => Promise.resolve({ success: true })) as any
      const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "continueWithGoogle" }).props.onPress()
      expect(GlobalStore.actions.auth.authGoogle).toHaveBeenCalled()
    })

    it("logs in using apple when the user presses on continue with apple", () => {
      GlobalStore.actions.auth.authApple = jest.fn(() => Promise.resolve({ success: true })) as any
      const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "continueWithApple" }).props.onPress()
      expect(GlobalStore.actions.auth.authApple).toHaveBeenCalled()
    })
  })

  describe("sign up", () => {
    afterAll(() => {
      jest.clearAllMocks()
    })
    it("navigates to sign up with email when the user presses on continue with email", () => {
      const tree = renderWithWrappers(<OnboardingSocialPick mode="signup" />)
      tree.root.findByProps({ testID: "continueWithEmail" }).props.onPress()
      expect(mockNavigate).toHaveBeenCalledWith("OnboardingCreateAccountWithEmail")
    })

    it("signs up using facebook when the user presses on continue with facebook", async () => {
      GlobalStore.actions.auth.authFacebook = jest.fn(() =>
        Promise.resolve({ success: true })
      ) as any

      const tree = renderWithWrappers(<OnboardingSocialPick mode="signup" />)
      tree.root.findByProps({ testID: "continueWithFacebook" }).props.onPress()
      expect(GlobalStore.actions.auth.authFacebook).toHaveBeenCalled()
    })

    it("signs up using google when the user presses on continue with google", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ ARGoogleAuth: true })
      GlobalStore.actions.auth.authGoogle = jest.fn(() => Promise.resolve({ success: true })) as any

      const tree = renderWithWrappers(<OnboardingSocialPick mode="signup" />)
      tree.root.findByProps({ testID: "continueWithGoogle" }).props.onPress()
      expect(GlobalStore.actions.auth.authGoogle).toHaveBeenCalled()
    })

    it("signs up in using apple when the user presses on continue with apple", () => {
      GlobalStore.actions.auth.authApple = jest.fn(() => Promise.resolve({ success: true })) as any
      const tree = renderWithWrappers(<OnboardingSocialPick mode="signup" />)
      tree.root.findByProps({ testID: "continueWithApple" }).props.onPress()
      expect(GlobalStore.actions.auth.authApple).toHaveBeenCalled()
    })
  })
})

describe("webView links ", () => {
  it("opens terms webView", () => {
    const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
    tree.root.findByProps({ testID: "openTerms" }).props.onPress()
    expect(mockNavigate).toHaveBeenCalledWith("OnboardingWebView", { url: "/terms" })
  })

  it("opens privacy webView", () => {
    const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
    tree.root.findByProps({ testID: "openPrivacy" }).props.onPress()
    expect(mockNavigate).toHaveBeenCalledWith("OnboardingWebView", { url: "/privacy" })
  })
})
