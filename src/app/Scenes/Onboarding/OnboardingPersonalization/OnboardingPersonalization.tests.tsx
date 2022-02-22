import { OnboardingPersonalization_highlights } from "__generated__/OnboardingPersonalization_highlights.graphql"
import { OnboardingPersonalizationTestsQuery } from "__generated__/OnboardingPersonalizationTestsQuery.graphql"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { mockFetchNotificationPermissions } from "lib/tests/mockFetchNotificationPermissions"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { PushAuthorizationStatus } from "lib/utils/PushNotification"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { OnboardingPersonalizationList } from "./OnboardingPersonalization"

jest.unmock("react-relay")

const navigateMock = jest.fn()

describe("OnboardingPersonalizationList", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<OnboardingPersonalizationTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query OnboardingPersonalizationTestsQuery($excludeArtistIDs: [String])
        @relay_test_operation {
          highlights {
            popularArtists(excludeFollowedArtists: true, excludeArtistIDs: $excludeArtistIDs) {
              internalID
              ...ArtistListItem_artist
            }
          }
        }
      `}
      variables={{ excludeArtistIDs: [] }}
      render={({ props }) => {
        if (props?.highlights) {
          return (
            <OnboardingPersonalizationList
              // no need to redeclare the OnboardingPersonalization_highlights fragment here
              highlights={props.highlights as OnboardingPersonalization_highlights}
              navigation={{ navigate: navigateMock } as any}
              route={null as any}
            />
          )
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  describe("SearchInput", () => {
    it("navigates to the OnboardingPersonalizationModal when the user presses on the search input", () => {
      const tree = renderWithWrappers(<TestRenderer />)
      mockEnvironmentPayload(mockEnvironment)

      const searchInput = tree.root.findByProps({ testID: "searchArtistButton" })
      searchInput.props.onPress()
      expect(navigateMock).toHaveBeenCalledWith("OnboardingPersonalizationModal")
    })
  })

  describe("Button", () => {
    it("Sets the onboarding state to complete and requests for push notifications permission when it's not yet determined", async () => {
      jest.useFakeTimers()

      mockFetchNotificationPermissions(false).mockImplementationOnce((cb) =>
        cb(null, PushAuthorizationStatus.NotDetermined)
      )

      const tree = renderWithWrappers(<TestRenderer />)
      mockEnvironmentPayload(mockEnvironment)

      const doneButton = tree.root.findByProps({ testID: "doneButton" })
      doneButton.props.onPress()

      jest.runAllTimers()

      expect(__globalStoreTestUtils__?.getCurrentState().auth.onboardingState).toEqual("complete")
      expect(
        LegacyNativeModules.ARTemporaryAPIModule.requestPrepromptNotificationPermissions
      ).toBeCalled()
    })
  })
})
