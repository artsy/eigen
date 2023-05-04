import { fireEvent } from "@testing-library/react-native"
import {
  ArtworkListsProvider,
  ArtworkListsProviderProps,
} from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkEntity } from "app/Components/ArtworkLists/types"
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
    it("should display artwork info", () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      expect(getByText(/Banksy/)).toBeTruthy()
      expect(getByText(/Artwork Title/)).toBeTruthy()
      expect(getByText(/2023/)).toBeTruthy()
    })

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

    describe("Selected/unselected artwork lists state", () => {
      it("all artwork lists should be unselected", async () => {
        const { queryAllByA11yState } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList,
            customArtworkLists,
          }),
        })

        await flushPromiseQueue()

        const selected = queryAllByA11yState({ selected: true })
        expect(selected).toHaveLength(0)
      })

      it("recently selected artwork lists should be preselected by default", async () => {
        const { queryAllByA11yState } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList: {
              ...savedArtworksArtworkList,
              isSavedArtwork: true,
            },
            customArtworkLists: {
              edges: [
                {
                  node: {
                    ...customArtworkListOne,
                    isSavedArtwork: true,
                  },
                },
                {
                  node: customArtworkListTwo,
                },
              ],
            },
          }),
        })

        await flushPromiseQueue()

        const selected = queryAllByA11yState({ selected: true })
        expect(selected).toHaveLength(2)
      })

      it("add selected state when artwork list is pressed", async () => {
        const { queryAllByA11yState, getByText } = renderWithHookWrappersTL(
          <TestRenderer />,
          mockEnvironment
        )

        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList,
            customArtworkLists,
          }),
        })

        await flushPromiseQueue()

        const selectedBefore = queryAllByA11yState({ selected: true })
        expect(selectedBefore).toHaveLength(0)

        fireEvent.press(getByText("Custom Artwork List 2"))

        const selectedAfter = queryAllByA11yState({ selected: true })
        expect(selectedAfter).toHaveLength(1)
      })

      it("unselect recently selected artwork lists", async () => {
        const { queryAllByA11yState, getByText } = renderWithHookWrappersTL(
          <TestRenderer />,
          mockEnvironment
        )

        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList: {
              ...savedArtworksArtworkList,
              isSavedArtwork: true,
            },
            customArtworkLists,
          }),
        })

        await flushPromiseQueue()

        // Select some custom artwork list
        fireEvent.press(getByText("Custom Artwork List 2"))

        const selectedBefore = queryAllByA11yState({ selected: true })
        expect(selectedBefore).toHaveLength(2)

        // Unselect all
        fireEvent.press(getByText("Saved Artworks"))
        fireEvent.press(getByText("Custom Artwork List 2"))

        const selectedAfter = queryAllByA11yState({ selected: true })
        expect(selectedAfter).toHaveLength(0)
      })
    })

    describe("Artworks count", () => {
      it("should render `x Artwork` when one artwork was saved", async () => {
        const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList: {
              ...savedArtworksArtworkList,
              artworksCount: 1,
            },
            customArtworkLists: { edges: [] },
          }),
        })

        expect(queryByText("1 Artwork")).toBeNull()
      })

      it("should render `x Artworks` when multiple artwork were saved", async () => {
        const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList,
            customArtworkLists: { edges: [] },
          }),
        })

        expect(queryByText("5 Artworks")).toBeNull()
      })
    })

    describe("Selected artwork lists counter", () => {
      describe("without selected artwork lists by default", () => {
        it("default state", async () => {
          const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

          resolveMostRecentRelayOperation(mockEnvironment, {
            Me: () => ({
              savedArtworksArtworkList,
              customArtworkLists,
            }),
          })

          await flushPromiseQueue()

          expect(getByText("0 lists selected")).toBeTruthy()
        })

        it("selected one artwork list", async () => {
          const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

          resolveMostRecentRelayOperation(mockEnvironment, {
            Me: () => ({
              savedArtworksArtworkList,
              customArtworkLists,
            }),
          })

          await flushPromiseQueue()

          fireEvent.press(getByText("Saved Artworks"))

          expect(getByText("1 list selected")).toBeTruthy()
        })

        it("selected multiple artwork lists", async () => {
          const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

          resolveMostRecentRelayOperation(mockEnvironment, {
            Me: () => ({
              savedArtworksArtworkList,
              customArtworkLists,
            }),
          })

          await flushPromiseQueue()

          fireEvent.press(getByText("Saved Artworks"))
          fireEvent.press(getByText("Custom Artwork List 1"))

          expect(getByText("2 lists selected")).toBeTruthy()
        })

        it("selected multiple artwork lists (select and unselect action)", async () => {
          const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

          resolveMostRecentRelayOperation(mockEnvironment, {
            Me: () => ({
              savedArtworksArtworkList,
              customArtworkLists,
            }),
          })

          await flushPromiseQueue()

          fireEvent.press(getByText("Saved Artworks"))
          fireEvent.press(getByText("Custom Artwork List 1"))
          expect(getByText("2 lists selected")).toBeTruthy()

          fireEvent.press(getByText("Saved Artworks"))
          expect(getByText("1 list selected")).toBeTruthy()
        })
      })

      describe("with selected artwork lists by default", () => {
        it("default state", async () => {
          const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

          resolveMostRecentRelayOperation(mockEnvironment, {
            Me: () => ({
              savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
              customArtworkLists: preselectedCustomArtworkLists,
            }),
          })

          await flushPromiseQueue()

          expect(getByText("3 lists selected")).toBeTruthy()
        })

        it("unselect preselected artwork lists", async () => {
          const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

          resolveMostRecentRelayOperation(mockEnvironment, {
            Me: () => ({
              savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
              customArtworkLists: preselectedCustomArtworkLists,
            }),
          })

          await flushPromiseQueue()

          fireEvent.press(getByText("Saved Artworks"))
          fireEvent.press(getByText("Custom Artwork List 1"))

          expect(getByText("1 list selected")).toBeTruthy()
        })

        it("unselect preselected and select again the same artwork lists", async () => {
          const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

          resolveMostRecentRelayOperation(mockEnvironment, {
            Me: () => ({
              savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
              customArtworkLists: preselectedCustomArtworkLists,
            }),
          })

          await flushPromiseQueue()

          fireEvent.press(getByText("Saved Artworks"))
          fireEvent.press(getByText("Custom Artwork List 1"))
          expect(getByText("1 list selected")).toBeTruthy()

          fireEvent.press(getByText("Saved Artworks"))
          fireEvent.press(getByText("Custom Artwork List 1"))
          expect(getByText("3 lists selected")).toBeTruthy()
        })

        it("unselect preselected and select other artwork lists", async () => {
          const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

          resolveMostRecentRelayOperation(mockEnvironment, {
            Me: () => ({
              savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
              customArtworkLists: preselectedCustomArtworkLists,
            }),
          })

          await flushPromiseQueue()

          fireEvent.press(getByText("Saved Artworks"))
          fireEvent.press(getByText("Custom Artwork List 1"))
          expect(getByText("1 list selected")).toBeTruthy()

          fireEvent.press(getByText("Custom Artwork List 3"))
          expect(getByText("2 lists selected")).toBeTruthy()
        })
      })
    })

    describe("Save button", () => {
      it("disabled by default", async () => {
        const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList,
            customArtworkLists,
          }),
        })

        await flushPromiseQueue()

        expect(getByText("Save")).toBeDisabled()
      })

      it("disabled when select and unselect the same artwork lists", async () => {
        const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList,
            customArtworkLists,
          }),
        })

        await flushPromiseQueue()

        fireEvent.press(getByText("Saved Artworks"))
        fireEvent.press(getByText("Custom Artwork List 1"))
        expect(getByText("Save")).toBeEnabled()

        fireEvent.press(getByText("Saved Artworks"))
        fireEvent.press(getByText("Custom Artwork List 1"))
        expect(getByText("Save")).toBeDisabled()
      })

      it("disabled when select and unselect the same preselected artwork lists", async () => {
        const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
            customArtworkLists: preselectedCustomArtworkLists,
          }),
        })

        await flushPromiseQueue()

        fireEvent.press(getByText("Saved Artworks"))
        fireEvent.press(getByText("Custom Artwork List 1"))
        expect(getByText("Save")).toBeEnabled()

        fireEvent.press(getByText("Saved Artworks"))
        fireEvent.press(getByText("Custom Artwork List 1"))
        expect(getByText("Save")).toBeDisabled()
      })

      it("enabled when select some new artwork lists", async () => {
        const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList,
            customArtworkLists,
          }),
        })

        await flushPromiseQueue()

        fireEvent.press(getByText("Saved Artworks"))
        fireEvent.press(getByText("Custom Artwork List 2"))

        expect(getByText("Save")).toBeEnabled()
      })

      it("enabled when unselect preselected artwork lists", async () => {
        const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
            customArtworkLists: preselectedCustomArtworkLists,
          }),
        })

        await flushPromiseQueue()

        fireEvent.press(getByText("Saved Artworks"))
        fireEvent.press(getByText("Custom Artwork List 1"))

        expect(getByText("Save")).toBeEnabled()
      })
    })
  })
})

const savedArtworksArtworkList = {
  internalID: "saved-artworks",
  name: "Saved Artworks",
  isSavedArtwork: false,
  artworksCount: 5,
}

const customArtworkListOne = {
  internalID: "custom-artwork-list-one",
  name: "Custom Artwork List 1",
  isSavedArtwork: false,
  artworksCount: 1,
}

const customArtworkListTwo = {
  internalID: "custom-artwork-list-two",
  name: "Custom Artwork List 2",
  isSavedArtwork: false,
  artworksCount: 2,
}

const customArtworkLists = {
  edges: [
    {
      node: customArtworkListOne,
    },
    {
      node: customArtworkListTwo,
    },
  ],
}

const preselectedSavedArtworksArtworkList = {
  ...savedArtworksArtworkList,
  isSavedArtwork: true,
}

const preselectedCustomArtworkLists = {
  edges: [
    {
      node: {
        ...customArtworkListOne,
        isSavedArtwork: true,
      },
    },
    {
      node: {
        ...customArtworkListTwo,
        isSavedArtwork: true,
      },
    },
    {
      node: {
        internalID: "custom-artwork-list-three",
        name: "Custom Artwork List 3",
        isSavedArtwork: false,
        artworksCount: 3,
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
