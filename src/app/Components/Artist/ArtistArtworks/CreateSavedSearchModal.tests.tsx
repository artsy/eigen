import { fireEvent } from "@testing-library/react-native"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { navigate } from "app/navigation/navigate"
import { CreateSavedSearchAlert } from "app/Scenes/SavedSearchAlert/CreateSavedSearchAlert"
import { SavedSearchAlertMutationResult } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { delay } from "app/utils/delay"
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
  sizeMetric: "cm",
}

const mockedMutationResult: SavedSearchAlertMutationResult = {
  id: "savedSearchAlertId",
}

describe("CreateSavedSearchModal", () => {
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
