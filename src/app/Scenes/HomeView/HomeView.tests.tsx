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
    renderWithRelay({})

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "screen",
      context_screen_owner_type: "home",
    })
  })
})
