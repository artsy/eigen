import { SavedSearchButtonTestsQuery } from "__generated__/SavedSearchButtonTestsQuery.graphql"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { PopoverMessage } from "app/Components/PopoverMessage/PopoverMessage"
import { navigate } from "app/navigation/navigate"
import { CreateSavedSearchAlert } from "app/Scenes/SavedSearchAlert/CreateSavedSearchAlert"
import { SavedSearchAlertMutationResult } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { SavedSearchButtonRefetchContainer as SavedSearchButton, tracks } from "./SavedSearchButton"

jest.unmock("react-relay")

const mockedAttributes: SearchCriteriaAttributes = {
  atAuction: true,
}

const mockedMutationResult: SavedSearchAlertMutationResult = {
  id: "savedSearchAlertId",
}

const mockedFilters = [
  {
    displayText: "Bid",
    paramName: FilterParamName.waysToBuyBid,
    paramValue: true,
  },
]

describe("SavedSearchButton", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImprovedAlertsFlow: false })
  })

  const TestRenderer = ({ attributes = mockedAttributes }) => {
    return (
      <QueryRenderer<SavedSearchButtonTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query SavedSearchButtonTestsQuery($criteria: SearchCriteriaAttributes!)
          @relay_test_operation {
            me {
              ...SavedSearchButton_me @arguments(criteria: $criteria)
            }
          }
        `}
        render={({ props, error }) => (
          <SavedSearchButton
            {...props}
            loading={props === null && error === null}
            filters={mockedFilters}
            criteria={attributes}
            aggregations={[]}
            artistId="artistID"
            artistName="artistName"
            artistSlug="artistSlug"
          />
        )}
        variables={{
          criteria: attributes,
        }}
      />
    )
  }

  it("renders loading state if request didn't return data and an error", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    expect(tree.root.findByType(Button).props.loading).toBe(true)
  })

  it("renders enabled button if criteria are not saved", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: null,
      }),
    })

    expect(tree.root.findByType(Button).props.disabled).toBe(false)
  })

  it("renders disabled button if criteria are saved", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: {
          internalID: "internalID",
        },
      }),
    })

    expect(tree.root.findByType(Button).props.disabled).toBe(true)
  })

  it("should show the create saved search form when the button is pressed", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: null,
      }),
    })

    act(() => tree.root.findByType(Button).props.onPress())

    expect(tree.root.findByType(CreateSavedSearchAlert).props.visible).toBeTruthy()
  })

  it("tracks clicks when the create alert button is pressed", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: null,
      }),
    })

    act(() => tree.root.findByType(Button).props.onPress())

    expect(mockTrackEvent).toHaveBeenCalledWith(tracks.tappedCreateAlert("artistID", "artistSlug"))
  })

  it("should navigate to the saved search alerts list when popover is pressed", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    act(() =>
      tree.root.findByType(CreateSavedSearchAlert).props.params.onComplete(mockedMutationResult)
    )
    act(() => tree.root.findByType(PopoverMessage).props.onPress())

    expect(navigate).toHaveBeenCalledWith("/my-profile/settings", {
      popToRootTabView: true,
      showInTabName: "profile",
    })
  })

  it("should call navigate twice", async () => {
    jest.useFakeTimers()
    const tree = renderWithWrappers(<TestRenderer />)

    act(() =>
      tree.root.findByType(CreateSavedSearchAlert).props.params.onComplete(mockedMutationResult)
    )
    act(() => tree.root.findByType(PopoverMessage).props.onPress())

    jest.runAllTimers()

    expect(navigate).toHaveBeenCalledWith("/my-profile/settings", {
      popToRootTabView: true,
      showInTabName: "profile",
    })
    expect(navigate).toHaveBeenCalledWith("/my-profile/saved-search-alerts")
  })

  it("tracks clicks when the create alert button is pressed", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    act(() =>
      tree.root.findByType(CreateSavedSearchAlert).props.params.onComplete(mockedMutationResult)
    )

    expect(mockTrackEvent).toHaveBeenCalledWith(
      tracks.toggleSavedSearch(true, "artistID", "artistSlug", "savedSearchAlertId")
    )
  })
})
