import { fireEvent } from "@testing-library/react-native"
import { OAuthProvider } from "app/auth/types"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { Platform } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { OnboardingNavigationStack } from "./Onboarding"
import { LinkAccountButton, OnboardingSocialLink } from "./OnboardingSocialLink"

jest.unmock("react-relay")

describe("OnboardingSocialLink", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const navigationMock = {
    addListener: jest.fn(),
    navigate: jest.fn(),
  }
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const defaultParams = {
    email: "email@mail.com",
    name: "my Name",
    tokenForProviderToBeLinked: "oauthtoken",
    providers: ["email", "google", "apple"] as OAuthProvider[],
    providerToBeLinked: "facebook" as OAuthProvider,
  }

  const getWrapper = (routeParams?: OnboardingNavigationStack["OnboardingSocialLink"]) => {
    return renderWithWrappersTL(
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <SafeAreaProvider initialSafeAreaInsets={{ top: 1, left: 2, right: 3, bottom: 4 }}>
          <OnboardingSocialLink
            navigation={navigationMock as any}
            route={{ params: { ...defaultParams, ...routeParams } } as any}
          />
        </SafeAreaProvider>
      </RelayEnvironmentProvider>
    )
  }

  it("Only permitted providers buttons are shown", () => {
    // google auth is not permitted
    __globalStoreTestUtils__?.injectFeatureFlags({ ARGoogleAuth: false })

    const tree = getWrapper()
    expect(tree.UNSAFE_getAllByType(LinkAccountButton).length).toEqual(2)
    expect(() => tree.getByTestId("linkWithGoogle")).toThrowError(
      "Unable to find an element with testID: linkWithGoogle"
    )
  })

  it("Only displays Email Form when only 'email' is the only existing permitted provider", () => {
    // google auth is not permitted
    __globalStoreTestUtils__?.injectFeatureFlags({ ARGoogleAuth: false })
    // apple auth is not allowed
    Platform.OS = "android"
    // providers we can display LinkAccountButtons for
    const providers: OAuthProvider[] = ["email", "google", "apple"]
    const params = { ...defaultParams, providers }
    const tree = getWrapper(params)

    expect(tree.getByTestId("artsySocialLinkPasswordInput")).toBeDefined()
    expect(() => tree.UNSAFE_getAllByType(LinkAccountButton).length).toThrowError(
      "No instances found"
    )
  })

  describe("Link Account Buttons", () => {
    it("Google Link Account Button logs in With Google and passes onSignIn callback", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ ARGoogleAuth: true })
      const spy = jest.spyOn(GlobalStore.actions.auth, "authGoogle")
      const params = { ...defaultParams, providers: ["email", "google"] as OAuthProvider[] }
      const tree = getWrapper(params)

      const linkWithGoogle = tree.getByTestId("linkWithGoogle")
      fireEvent.press(linkWithGoogle)
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          signInOrUp: "signIn",
          onSignIn: expect.any(Function),
        })
      )
    })

    it("Apple Link Account Button logs in With Apple and passes onSignIn callback", () => {
      Platform.OS = "ios"
      const spy = jest.spyOn(GlobalStore.actions.auth, "authApple")
      const params = {
        ...defaultParams,
        providers: ["email", "apple"] as OAuthProvider[],
        tokenforProviderToBeLinked: {
          idToken: "idToken",
          appleUid: "appleUid",
        },
      }
      const tree = getWrapper(params)

      const linkWithApple = tree.getByTestId("linkWithApple")
      fireEvent.press(linkWithApple)
      expect(spy).toBeCalledWith({
        onSignIn: expect.any(Function),
      })
    })

    it("Facebook Link Account Button logs in With Facebook and passes onSignIn callback", () => {
      const spy = jest.spyOn(GlobalStore.actions.auth, "authFacebook")
      const params = {
        ...defaultParams,
        providers: ["email", "facebook"] as OAuthProvider[],
        providerToBeLinked: "google" as OAuthProvider,
      }
      const tree = getWrapper(params)

      const linkWithFacebook = tree.getByTestId("linkWithFacebook")
      fireEvent.press(linkWithFacebook)
      expect(spy).toBeCalledWith({
        signInOrUp: "signIn",
        onSignIn: expect.any(Function),
      })
    })

    it("Email Link Account Button switches screen to show only password form", () => {
      const tree = getWrapper()
      expect(() => tree.getByTestId("artsySocialLinkPasswordInput")).toThrowError(
        "Unable to find an element with testID: artsySocialLinkPasswordInput"
      )
      const linkWithEmail = tree.getByTestId("linkWithEmail")
      fireEvent.press(linkWithEmail)
      expect(tree.getByTestId("artsySocialLinkPasswordInput")).toBeDefined()
    })
  })
})
