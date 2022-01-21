import { useNavigation } from "@react-navigation/native"
import { navigate } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Platform } from "react-native"
import { OnboardingSocialPick } from "../OnboardingSocialPick"

jest.mock("@react-navigation/native")

const navigateMock = jest.fn()

describe("OnboardingSocialPick", () => {
  beforeEach(() => {
    ;(useNavigation as jest.Mock).mockReturnValue({
      setParams: jest.fn(),
      goBack: jest.fn(),
      navigate: navigateMock,
    })
  })

  describe("login", () => {
    it("navigates to log in with email when the user presses on continue with email", () => {
      const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "useEmail" }).props.onPress()
      expect(navigateMock).toHaveBeenCalledWith("OnboardingLoginWithEmail")
    })

    it("logs in using facebook when the user presses on continue with facebook", async () => {
      GlobalStore.actions.auth.authFacebook = jest.fn() as any

      const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "useFacebook" }).props.onPress()
      expect(GlobalStore.actions.auth.authFacebook).toHaveBeenCalledWith({ signInOrUp: "signIn" })
    })

    it("logs in using apple when the user presses on continue with apple", () => {
      GlobalStore.actions.auth.authApple = jest.fn() as any

      const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "useApple" }).props.onPress()
      expect(GlobalStore.actions.auth.authApple).toHaveBeenCalled()
    })
  })

  describe("sign up", () => {
    it("navigates to sign up with email when the user presses on continue with email", () => {
      const tree = renderWithWrappers(<OnboardingSocialPick mode="signup" />)
      tree.root.findByProps({ testID: "useEmail" }).props.onPress()
      expect(navigateMock).toHaveBeenCalledWith("OnboardingLoginWithEmail")
    })

    it("signs up using facebook when the user presses on continue with facebook", async () => {
      GlobalStore.actions.auth.authFacebook = jest.fn() as any

      const tree = renderWithWrappers(<OnboardingSocialPick mode="signup" />)
      tree.root.findByProps({ testID: "useFacebook" }).props.onPress()
      expect(GlobalStore.actions.auth.authFacebook).toHaveBeenCalledWith({
        agreedToReceiveEmails: true,
        signInOrUp: "signUp",
      })
    })

    it("signs up in using apple when the user presses on continue with apple", () => {
      GlobalStore.actions.auth.authApple = jest.fn() as any

      const tree = renderWithWrappers(<OnboardingSocialPick mode="signup" />)
      tree.root.findByProps({ testID: "useApple" }).props.onPress()
      expect(GlobalStore.actions.auth.authApple).toHaveBeenCalledWith({
        agreedToReceiveEmails: true,
      })
    })
  })
})

describe("webView links ", () => {
  describe("on Android", () => {
    beforeEach(() => {
      Platform.OS = "android"
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateMock,
      })
    })

    it("opens terms webView", () => {
      const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "openTerms" }).props.onPress()
      expect(navigateMock).toHaveBeenCalledWith("Terms")
    })

    it("opens privacy webView", () => {
      const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "openPrivacy" }).props.onPress()
      expect(navigateMock).toHaveBeenCalledWith("Privacy")
    })
  })
})

describe("on iOS", () => {
  beforeEach(() => {
    Platform.OS = "ios"
  })

  it("opens terms webView modaly", () => {
    const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
    tree.root.findByProps({ testID: "openTerms" }).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/terms", { modal: true })
  })

  it("opens privacy webView modaly", () => {
    const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
    tree.root.findByProps({ testID: "openPrivacy" }).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/privacy", { modal: true })
  })
})
