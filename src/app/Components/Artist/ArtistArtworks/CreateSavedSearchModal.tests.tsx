import { OwnerType } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { CreateSavedSearchAlert } from "app/Scenes/SavedSearchAlert/CreateSavedSearchAlert"
import { SavedSearchAlertMutationResult } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { navigate } from "app/system/navigation/navigate"
import { delay } from "app/utils/delay"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import {
  CreateSavedSearchModal,
  CreateSavedSearchModalProps,
  tracks,
} from "./CreateSavedSearchModal"

const savedSearchEntity: SavedSearchEntity = {
  placeholder: "Placeholder",
  artists: [{ id: "artistId", name: "artistName" }],
  owner: {
    type: OwnerType.artist,
    id: "ownerId",
    slug: "ownerSlug",
  },
}

const attributes: SearchCriteriaAttributes = {
  artistIDs: ["artistId"],
}

const defaultProps: CreateSavedSearchModalProps = {
  visible: true,
  entity: savedSearchEntity,
  attributes,
  aggregations: [],
  closeModal: jest.fn,
}

const mockedMutationResult: SavedSearchAlertMutationResult = {
  id: "savedSearchAlertId",
}

describe("CreateSavedSearchModal", () => {
  const TestRenderer = (props?: Partial<CreateSavedSearchModalProps>) => {
    return <CreateSavedSearchModal {...defaultProps} {...props} />
  }

  it("renders without throwing an error", () => {
    renderWithWrappers(<TestRenderer />)
  })

  it("should navigate to the saved search alerts list when popover is pressed", async () => {
    const { getByText, UNSAFE_root } = renderWithWrappers(<TestRenderer />)

    UNSAFE_root.findByType(CreateSavedSearchAlert).props.params.onComplete(mockedMutationResult)

    fireEvent.press(getByText("Your alert has been created."))

    expect(navigate).toHaveBeenCalledWith("/my-profile/settings", {
      popToRootTabView: true,
      showInTabName: "profile",
    })
  })

  it("should call navigate twice", async () => {
    const { UNSAFE_root, getByText } = renderWithWrappers(<TestRenderer />)

    UNSAFE_root.findByType(CreateSavedSearchAlert).props.params.onComplete(mockedMutationResult)
    fireEvent.press(getByText("Your alert has been created."))

    await delay(200)

    expect(navigate).toHaveBeenCalledWith("/my-profile/settings", {
      popToRootTabView: true,
      showInTabName: "profile",
    })
    expect(navigate).toHaveBeenCalledWith("/my-profile/saved-search-alerts")
  })

  it("tracks clicks when the create alert button is pressed", async () => {
    const { UNSAFE_root } = renderWithWrappers(<TestRenderer />)

    UNSAFE_root.findByType(CreateSavedSearchAlert).props.params.onComplete(mockedMutationResult)

    expect(mockTrackEvent).toHaveBeenCalledWith(
      tracks.toggleSavedSearch(true, OwnerType.artist, "ownerId", "ownerSlug", "savedSearchAlertId")
    )
  })
})
