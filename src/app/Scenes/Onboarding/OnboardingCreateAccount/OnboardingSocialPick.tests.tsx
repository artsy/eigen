import { useNavigation } from "@react-navigation/native"
import { navigate } from "app/navigation/navigate"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
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
    afterAll(() => {
      jest.clearAllMocks()
    })
    it("navigates to log in with email when the user presses on continue with email", () => {
      const tree = renderWithWrappers(<OnboardingSocialPick mode="login" />)
      tree.root.findByProps({ testID: "continueWithEmail" }).props.onPress()
      expect(navigateMock).toHaveBeenCalledWith("OnboardingLoginWithEmail")
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
      expect(navigateMock).toHaveBeenCalledWith("OnboardingCreateAccountWithEmail")
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
