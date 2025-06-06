import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { CreateSavedSearchAlert } from "app/Scenes/SavedSearchAlert/CreateSavedSearchAlert"
import {
  CreateSavedSearchModal,
  CreateSavedSearchModalProps,
  tracks,
} from "app/Scenes/SavedSearchAlert/CreateSavedSearchModal"
import {
  CreateSavedSearchAlertNavigationStack,
  SavedSearchAlertMutationResult,
} from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import {
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

jest.mock("app/Scenes/SavedSearchAlert/queries/getAlertByCriteria", () => ({
  getAlertByCriteria: () => Promise.resolve(null),
}))

jest.mock("app/Scenes/SavedSearchAlert/mutations/createSavedSearchAlert", () => ({
  createSavedSearchAlert: () =>
    Promise.resolve({
      createAlert: {
        responseOrError: {
          alert: { internalID: "new-alert-4242", searchCriteriaID: "criteria-id" },
        },
      },
    }),
}))

jest.mock("app/Scenes/SavedSearchAlert/useSavedSearchPills", () => {
  return {
    useSavedSearchPills: () => [],
  }
})

const mockNavigate = jest.fn()
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => {
      return {
        navigate: mockNavigate,
        addListener: jest.fn(),
      }
    },
    useRoute: () => {
      const params: CreateSavedSearchAlertNavigationStack["ConfirmationScreen"] = {
        searchCriteriaID: "foo-bar-42",
        closeModal: jest.fn(),
      }

      return { params }
    },
  }
})

const savedSearchEntity: SavedSearchEntity = {
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
  closeModal: jest.fn,
}

const mockedMutationResult: SavedSearchAlertMutationResult = {
  id: "savedSearchAlertId",
  searchCriteriaID: "searchCriteriaID",
}

const TestWrapper: React.FC = ({ children }) => (
  <SavedSearchStoreProvider
    runtimeModel={{
      ...savedSearchModel,
      attributes,
      entity: savedSearchEntity,
    }}
  >
    {children}
  </SavedSearchStoreProvider>
)

describe("CreateSavedSearchModal", () => {
  const TestRenderer = (props?: Partial<CreateSavedSearchModalProps>) => {
    return <CreateSavedSearchModal {...defaultProps} {...props} />
  }

  it("renders without throwing an error", () => {
    renderWithWrappers(<TestRenderer />)
  })

  it("tracks clicks when the create alert button is pressed", async () => {
    const { UNSAFE_root } = renderWithWrappers(<TestRenderer />)

    const createSavedSearchAlert = await UNSAFE_root.findByType(CreateSavedSearchAlert)
    createSavedSearchAlert.props.params.onComplete(mockedMutationResult)

    expect(mockTrackEvent).toHaveBeenCalledWith(
      tracks.toggleSavedSearch(true, OwnerType.artist, "ownerId", "ownerSlug", "searchCriteriaID")
    )
  })

  it("navigates to the confirmation screen", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <TestWrapper>
          <CreateSavedSearchModal {...defaultProps} />,
        </TestWrapper>
      ),
    })

    const { mockResolveLastOperation } = renderWithRelay()

    await waitFor(() => {
      mockResolveLastOperation({})
    })

    expect(screen.getByTestId("save-alert-button")).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId("save-alert-button"))

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("ConfirmationScreen", {
        alertID: "new-alert-4242",
        searchCriteriaID: "criteria-id",
      })
    )
  })
})
