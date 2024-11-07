import { screen } from "@testing-library/react-native"
import { HomeViewSectionArtworksTestsQuery } from "__generated__/HomeViewSectionArtworksTestsQuery.graphql"
import * as dismissSavedArtworkModule from "app/Components/ProgressiveOnboarding/useDismissSavedArtwork"
import { HomeViewScreen } from "app/Scenes/HomeView/HomeView"
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

  it("fires a screen view event", () => {
    renderWithRelay()

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "screen",
      context_screen_owner_type: "home",
    })
  })

  it("renders an email confirmation banner", async () => {
    renderWithRelay({
      Me: () => ({
        canRequestEmailConfirmation: true,
      }),
    })

    expect(screen.getByText("Tap here to verify your email address")).toBeTruthy()
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
