import { fireEvent } from "@testing-library/react-native"
import {
  ArtworkEntity,
  ArtworkListsProvider,
  ArtworkListsProviderProps,
} from "app/Components/ArtworkLists/ArtworkListsContext"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("@gorhom/bottom-sheet", () => {
  const RN = require("react-native")

  return {
    ...jest.requireActual("@gorhom/bottom-sheet/mock"),
    BottomSheetFlatList: RN.FlatList,
  }
})

describe("ArtworkListsProvider", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = (props: Partial<ArtworkListsProviderProps> = {}) => {
    return <ArtworkListsProvider artwork={artworkEntity} {...props} />
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  describe("Select lists for artwork", () => {
    it("should not be displayed by default", () => {
      const { queryByText } = renderWithHookWrappersTL(
        <TestRenderer artwork={undefined} />,
        mockEnvironment
      )

      expect(queryByText("Select lists for this artwork")).toBeNull()
    })

    it("should be displayed when artwork is set", () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      expect(getByText("Select lists for this artwork")).toBeTruthy()
    })

    it("should display `Save` button", () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      expect(getByText("Save")).toBeTruthy()
    })

    it("should display artwork lists", async () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Me: () => ({
          savedArtworksArtworkList,
          customArtworkLists,
        }),
      })

      await flushPromiseQueue()

      expect(getByText("Saved Artworks")).toBeTruthy()
      expect(getByText("Custom Artwork List 1")).toBeTruthy()
      expect(getByText("Custom Artwork List 2")).toBeTruthy()
    })

    it("should navigate to the create new artwork list flow when button is pressed", () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      fireEvent.press(getByText("Create New List"))

      expect(getByText("Create a new list")).toBeTruthy()
    })
  })
})

const savedArtworksArtworkList = {
  internalID: "saved-artworks",
  name: "Saved Artworks",
}

const customArtworkLists = {
  edges: [
    {
      node: {
        internalID: "custom-artwork-list-one",
        name: "Custom Artwork List 1",
      },
    },
    {
      node: {
        internalID: "custom-artwork-list-two",
        name: "Custom Artwork List 2",
      },
    },
  ],
}

const artworkEntity: ArtworkEntity = {
  id: "artwork-id",
  internalID: "artwork-internal-id",
  title: "Artwork Title",
  year: "2023",
  artistNames: "Banksy",
  imageURL: null,
}
