import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionArtworksTestsQuery } from "__generated__/HomeViewSectionArtworksTestsQuery.graphql"
import * as dismissSavedArtworkModule from "app/Components/ProgressiveOnboarding/useDismissSavedArtwork"
import { HomeViewScreen } from "app/Scenes/HomeView/HomeView"
import { GlobalStore, __globalStoreTestUtils__ } from "app/store/GlobalStore"
import * as requestPushNotificationsPermissionModule from "app/utils/requestPushNotificationsPermission"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { act } from "react-test-renderer"

const useDismissSavedArtworkSpy = jest.spyOn(dismissSavedArtworkModule, "useDismissSavedArtwork")
const requestPushNotificationsPermissionSpy = jest.spyOn(
  requestPushNotificationsPermissionModule,
  "requestPushNotificationsPermission"
)

jest.mock("app/utils/hooks/useIsDeepLink", () => {
  return {
    useIsDeepLink: jest.fn().mockReturnValue({ isDeepLink: false }),
  }
})

describe("HomeView", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionArtworksTestsQuery>({
    Component: () => {
      return <HomeViewScreen />
    },
    query: graphql`
      query HomeViewTestsQuery($count: Int!, $cursor: String) @relay_test_operation {
        homeView {
          experiments {
            name
            variant
            enabled
          }
        }
        viewer {
          ...HomeViewSectionsConnection_viewer @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  })

  describe("progressive onboarding setup", () => {
    it("dismisses 'save-artwork' onboarding flow when user has saves", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      act(() => {
        mockResolveLastOperation({
          Me: () => ({
            counts: {
              savedArtworks: 1,
            },
          }),
        })
      })

      await flushPromiseQueue()

      expect(useDismissSavedArtworkSpy).toHaveBeenCalledWith(true)
    })

    it("doesn't dismiss 'save-artwork' onboarding flow when user has no saves", () => {
      renderWithRelay({
        Me: () => ({
          counts: {
            savedArtworks: 0,
          },
        }),
      })

      expect(useDismissSavedArtworkSpy).toHaveBeenCalledWith(false)
    })
  })

  it("request push notification permissions on mount", () => {
    renderWithRelay({})

    expect(requestPushNotificationsPermissionSpy).toHaveBeenCalled()
  })

  it("renders an email confirmation banner", async () => {
    renderWithRelay({
      Me: () => ({
        canRequestEmailConfirmation: true,
      }),
    })

    expect(screen.getByText("Tap here to verify your email address")).toBeTruthy()
  })

  // Full behavior coverage (the onboarding-goal gate, the once-per-mount guard, the
  // unmount reset) lives in useHomeViewReadyForOnboardingCompletionAnimation's own tests —
  // this just confirms HomeView actually wires that hook's onLayout to its FlatList.
  it("marks Home ready for the onboarding completion animation once its FlatList lays out", () => {
    jest.spyOn(global, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0)
      return 0
    })
    GlobalStore.actions.infiniteDiscovery.resetNewUserOnboardingSessionState()
    for (let i = 1; i <= 5; i++) {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: `artwork-${i}`,
        url: `https://example.com/${i}.jpg`,
      })
    }

    renderWithRelay({})

    fireEvent(screen.getByTestId("home-view-flat-list"), "layout", {
      nativeEvent: { layout: { x: 0, y: 0, width: 100, height: 100 } },
    })

    expect(
      __globalStoreTestUtils__?.getCurrentState().bottomTabs.sessionState
        .isHomeViewReadyForOnboardingCompletionAnimation
    ).toBe(true)

    jest.restoreAllMocks()
  })

  describe("home view experiments", () => {
    it("fires an experiment_viewed event for enabled experiments", () => {
      renderWithRelay({
        HomeView: () => ({
          experiments: [
            {
              name: "some_experiment",
              variant: "some_variant",
              enabled: true,
            },
          ],
        }),
      })

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "experiment_viewed",
          experiment_name: "some_experiment",
          variant_name: "some_variant",
          context_owner_type: "home",
        })
      )
    })

    it("does not fire an experiment_viewed event for disabled experiments", () => {
      renderWithRelay({
        HomeView: () => ({
          experiments: [
            {
              name: "some_experiment",
              variant: "some_variant",
              enabled: false,
            },
          ],
        }),
      })

      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({
          action: "experiment_viewed",
        })
      )
    })

    it("does not fire an experiment_viewed event when variant is missing", () => {
      renderWithRelay({
        HomeView: () => ({
          experiments: [
            {
              name: "some_experiment",
              variant: null,
              enabled: true,
            },
          ],
        }),
      })

      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({
          action: "experiment_viewed",
        })
      )
    })
  })
})
