import { OnboardingPersonalization_highlights } from "__generated__/OnboardingPersonalization_highlights.graphql"
import { OnboardingPersonalizationTestsQuery } from "__generated__/OnboardingPersonalizationTestsQuery.graphql"
import { ArtistListItem } from "lib/Components/ArtistListItem"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { __globalStoreTestUtils__ } from "../../../../store/GlobalStore"
import { flushPromiseQueue } from "../../../../tests/flushPromiseQueue"
import { OnboardingPersonalizationList } from "../OnboardingPersonalization"

jest.unmock("react-relay")

const navigateMock = jest.fn()
const refetchMock = jest.fn()

describe("OnboardingPersonalizationList", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<OnboardingPersonalizationTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query OnboardingPersonalizationTestsQuery($excludeArtistIDs: [String]) @relay_test_operation {
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
              relay={{ refetch: refetchMock } as any}
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

  describe("List of artist", () => {
    it("refetches connection with excludeArtistIDs after following an artist", async () => {
      const tree = renderWithWrappers(<TestRenderer />)
      mockEnvironmentPayload(mockEnvironment)

      const firstArtistRow = tree.root.findAllByType(ArtistListItem)[0]
      firstArtistRow.props.onFollowFinish()

      await flushPromiseQueue()

      expect(refetchMock).toHaveBeenLastCalledWith({ excludeArtistIDs: ["internalID-1"] })
    })
  })

  describe("Button", () => {
    it("Sets the onboarding state to complete", async () => {
      const tree = renderWithWrappers(<TestRenderer />)
      mockEnvironmentPayload(mockEnvironment)

      const doneButton = tree.root.findByProps({ testID: "doneButton" })
      doneButton.props.onPress()

      await flushPromiseQueue()
      expect(__globalStoreTestUtils__?.getCurrentState().auth.onboardingState).toEqual("complete")
    })
  })
})
