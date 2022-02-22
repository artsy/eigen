import { fireEvent } from "@testing-library/react-native"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { navigate } from "lib/navigation/navigate"
import { CreateSavedSearchAlert } from "lib/Scenes/SavedSearchAlert/CreateSavedSearchAlert"
import { SavedSearchAlertMutationResult } from "lib/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { delay } from "lib/utils/delay"
import React from "react"
import {
  CreateSavedSearchModal,
  CreateSavedSearchModalProps,
  tracks,
} from "./CreateSavedSearchModal"

jest.unmock("react-relay")

const defaultProps: CreateSavedSearchModalProps = {
  visible: true,
  artistId: "artistId",
  artistName: "artistName",
  artistSlug: "artistSlug",
  closeModal: jest.fn,
}

const initialData: ArtworkFiltersState = {
  selectedFilters: [],
  appliedFilters: [],
  previouslyAppliedFilters: [],
  applyFilters: false,
  aggregations: [],
  filterType: "artwork",
  counts: {
    total: null,
    followedArtists: null,
  },
}

const mockedMutationResult: SavedSearchAlertMutationResult = {
  id: "savedSearchAlertId",
}

describe("CreateSavedSearchModal", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImprovedAlertsFlow: true })
  })

  const TestRenderer = (props?: Partial<CreateSavedSearchModalProps>) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <CreateSavedSearchModal {...defaultProps} {...props} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders without throwing an error", () => {
    renderWithWrappersTL(<TestRenderer />)
  })

  it("should navigate to the saved search alerts list when popover is pressed", async () => {
    const { container, getByText } = renderWithWrappersTL(<TestRenderer />)

    container.findByType(CreateSavedSearchAlert).props.params.onComplete(mockedMutationResult)
    fireEvent.press(getByText("Your alert has been created."))

    expect(navigate).toHaveBeenCalledWith("/my-profile/settings", {
      popToRootTabView: true,
      showInTabName: "profile",
    })
  })

  it("should call navigate twice", async () => {
    const { container, getByText } = renderWithWrappersTL(<TestRenderer />)

    container.findByType(CreateSavedSearchAlert).props.params.onComplete(mockedMutationResult)
    fireEvent.press(getByText("Your alert has been created."))

    await delay(200)

    expect(navigate).toHaveBeenCalledWith("/my-profile/settings", {
      popToRootTabView: true,
      showInTabName: "profile",
    })
    expect(navigate).toHaveBeenCalledWith("/my-profile/saved-search-alerts")
  })

  it("tracks clicks when the create alert button is pressed", async () => {
    const { container } = renderWithWrappersTL(<TestRenderer />)

    container.findByType(CreateSavedSearchAlert).props.params.onComplete(mockedMutationResult)

    expect(mockTrackEvent).toHaveBeenCalledWith(
      tracks.toggleSavedSearch(true, "artistId", "artistSlug", "savedSearchAlertId")
    )
  })
})
