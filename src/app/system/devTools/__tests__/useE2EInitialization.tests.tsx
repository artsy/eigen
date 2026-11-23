import { waitFor } from "@testing-library/react-native"
import { GlobalStore, __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useE2EInitialization } from "app/system/devTools/useE2EInitialization"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { LaunchArguments } from "react-native-launch-arguments"

jest.mock("react-native-launch-arguments", () => ({
  LaunchArguments: { value: jest.fn() },
}))

const TestComponent = () => {
  useE2EInitialization()
  return null
}

describe("useE2EInitialization", () => {
  const mockLaunchArguments = (args: object) => {
    ;(LaunchArguments.value as jest.Mock).mockReturnValue(args)
  }

  const localOverrides = () =>
    __globalStoreTestUtils__?.getCurrentState().artsyPrefs.features.localOverrides

  it("turns on the feature flags named in enableFeatureFlags", () => {
    mockLaunchArguments({
      useE2EInit: true,
      enableFeatureFlags: "AREnableShareShowPartnerFeature, NotARealFlag",
    })

    renderWithWrappers(<TestComponent />)

    expect(localOverrides()).toMatchObject({ AREnableShareShowPartnerFeature: true })
    expect(localOverrides()).not.toHaveProperty("NotARealFlag")
  })

  it("ignores enableFeatureFlags outside e2e runs", () => {
    mockLaunchArguments({ enableFeatureFlags: "AREnableShareShowPartnerFeature" })

    renderWithWrappers(<TestComponent />)

    expect(localOverrides()).not.toHaveProperty("AREnableShareShowPartnerFeature")
  })

  describe("signing out", () => {
    const pushPromptLogic = () =>
      __globalStoreTestUtils__?.getCurrentState().artsyPrefs.pushPromptLogic

    it("keeps the push prompt hidden after signing out", async () => {
      // The real signOut resets pushPermissionsRequestedThisSession, so do the same here
      const signOut = jest.spyOn(GlobalStore.actions.auth, "signOut").mockImplementation(() => {
        GlobalStore.actions.artsyPrefs.pushPromptLogic.setPushPermissionsRequestedThisSession(false)
        return Promise.resolve() as any
      })
      __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: "token" } })
      mockLaunchArguments({ useE2EInit: true, shouldSignOut: true })

      renderWithWrappers(<TestComponent />)

      expect(signOut).toHaveBeenCalled()
      await waitFor(() => expect(pushPromptLogic()?.pushPermissionsRequestedThisSession).toBe(true))

      signOut.mockRestore()
    })
  })

  describe("signing in with email and password", () => {
    const mockPassword = "test-password" // pragma: allowlist secret

    let signIn: jest.SpyInstance

    beforeEach(() => {
      signIn = jest.spyOn(GlobalStore.actions.auth, "signIn").mockResolvedValue(true as any)
    })

    afterEach(() => {
      signIn.mockRestore()
    })

    it("signs in when signed out", () => {
      __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: null, userEmail: null } })
      mockLaunchArguments({ useE2EInit: true, email: "e2e@artsy.net", password: mockPassword })

      renderWithWrappers(<TestComponent />)

      expect(signIn).toHaveBeenCalledWith(
        expect.objectContaining({ email: "e2e@artsy.net", password: mockPassword })
      )
    })

    it("keeps the session when already signed in as the same email", () => {
      __globalStoreTestUtils__?.injectState({
        auth: { userAccessToken: "token", userEmail: "E2E@artsy.net" },
      })
      mockLaunchArguments({ useE2EInit: true, email: "e2e@artsy.net", password: mockPassword })

      renderWithWrappers(<TestComponent />)

      expect(signIn).not.toHaveBeenCalled()
    })

    it("signs in when signed in as a different email", () => {
      __globalStoreTestUtils__?.injectState({
        auth: { userAccessToken: "token", userEmail: "someone-else@artsy.net" },
      })
      mockLaunchArguments({ useE2EInit: true, email: "e2e@artsy.net", password: mockPassword })

      renderWithWrappers(<TestComponent />)

      expect(signIn).toHaveBeenCalled()
    })
  })
})
