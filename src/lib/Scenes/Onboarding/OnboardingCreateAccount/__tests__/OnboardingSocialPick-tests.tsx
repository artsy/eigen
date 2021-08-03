import { useNavigation } from "@react-navigation/native"
import { GlobalStore } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { OnboardingSocialPick } from "../../OnboardingSocialPick"

jest.mock("@react-navigation/native")

describe("OnboardingSocialPick", () => {
  const navigateMock = jest.fn()

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
      expect(GlobalStore.actions.auth.authFacebook).toHaveBeenCalledWith({ signInOrUp: "signUp" })
    })

    it("signs up in using apple when the user presses on continue with apple", () => {
      GlobalStore.actions.auth.authApple = jest.fn() as any

      const tree = renderWithWrappers(<OnboardingSocialPick mode="signup" />)
      tree.root.findByProps({ testID: "useApple" }).props.onPress()
      expect(GlobalStore.actions.auth.authApple).toHaveBeenCalled()
    })
  })
})
