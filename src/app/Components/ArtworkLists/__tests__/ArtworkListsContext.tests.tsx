import { fireEvent, screen } from "@testing-library/react-native"
import { SelectArtworkListsForArtworkQuery } from "__generated__/SelectArtworkListsForArtworkQuery.graphql"
import { ArtworkListsProvider } from "app/Components/ArtworkLists/ArtworkListsStore"
import { ArtworkEntity } from "app/Components/ArtworkLists/types"
import * as utils from "app/Components/ArtworkLists/types"
import { selectArtworkListsForArtworkQuery } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtwork"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ArtworkListsProvider", () => {
  const initialStateSpy = jest.spyOn(utils, "getArtworkListsStoreInitialState")

  const { renderWithRelay } = setupTestWrapper<SelectArtworkListsForArtworkQuery>({
    Component: () => <ArtworkListsProvider />,
    query: selectArtworkListsForArtworkQuery,
    variables: { artworkID: "banksy" },
    wrapperProps: { includeArtworkLists: false },
  })

  beforeEach(() => {
    jest.clearAllMocks()
    initialStateSpy.mockReturnValue({
      ...utils.ARTWORK_LISTS_STORE_INITIAL_STATE,
      artwork: artworkEntity,
      selectArtworkListsViewVisible: true,
    })
  })

  describe("Select lists for artwork", () => {
    it("should not be displayed by default", () => {
      initialStateSpy.mockReturnValue({
        ...utils.ARTWORK_LISTS_STORE_INITIAL_STATE,
        artwork: null,
        selectArtworkListsViewVisible: true,
      })
      renderWithRelay()

      expect(
        screen.queryByText("Select where you’d like to save this artwork:")
      ).not.toBeOnTheScreen()
    })

    it("should be displayed when artwork is set", () => {
      renderWithRelay()

      expect(screen.getByText("Select where you’d like to save this artwork:")).toBeOnTheScreen()
    })

    it("should display artwork lists", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({ Me: () => ({ savedArtworksArtworkList, customArtworkLists }) })

      await screen.findByText("Saved Artworks")
      expect(screen.getByText("Custom Artwork List 1")).toBeOnTheScreen()
      expect(screen.getByText("Custom Artwork List 2")).toBeOnTheScreen()
    })

    it("should navigate to the create new artwork list flow when button is pressed", () => {
      renderWithRelay()

      fireEvent.press(screen.getByText("Create New List"))

      expect(screen.getByText("New list")).toBeOnTheScreen()
    })

    describe("Selected/unselected artwork lists state", () => {
      it("all artwork lists should be unselected", async () => {
        const { mockResolveLastOperation } = renderWithRelay()

        mockResolveLastOperation({ Me: () => ({ savedArtworksArtworkList, customArtworkLists }) })

        await screen.findByText("Saved Artworks")
        expect(screen.getByText("Custom Artwork List 1")).toBeOnTheScreen()
        expect(screen.getByText("Custom Artwork List 2")).toBeOnTheScreen()

        const options = screen.getAllByTestId("artworkListItem")
        const unchecked = screen.queryAllByTestId("artworkListItemUnselectedIcon")

        expect(options).toHaveLength(3)
        expect(unchecked).toHaveLength(3)
      })

      it("recently selected artwork lists should be preselected by default", async () => {
        const { mockResolveLastOperation } = renderWithRelay()

        mockResolveLastOperation({
          Me: () => ({
            savedArtworksArtworkList: { ...savedArtworksArtworkList, isSavedArtwork: true },
            customArtworkLists: {
              edges: [
                { node: { ...customArtworkListOne, isSavedArtwork: true } },
                { node: customArtworkListTwo },
              ],
            },
          }),
        })

        await screen.findByText("Saved Artworks")
        expect(screen.getByText("Custom Artwork List 1")).toBeOnTheScreen()
        expect(screen.getByText("Custom Artwork List 2")).toBeOnTheScreen()

        const options = screen.getAllByTestId("artworkListItem")
        const unchecked = screen.queryAllByTestId("artworkListItemUnselectedIcon")
        const checked = screen.queryAllByTestId("artworkListItemSelectedIcon")

        expect(options).toHaveLength(3)
        expect(checked).toHaveLength(2)
        expect(unchecked).toHaveLength(1)
      })

      it("add selected state when artwork list is pressed", async () => {
        const { mockResolveLastOperation } = renderWithRelay()

        mockResolveLastOperation({ Me: () => ({ savedArtworksArtworkList, customArtworkLists }) })

        await screen.findByText("Saved Artworks")
        expect(screen.getByText("Custom Artwork List 1")).toBeOnTheScreen()
        expect(screen.getByText("Custom Artwork List 2")).toBeOnTheScreen()

        const options = screen.getAllByTestId("artworkListItem")
        const unchecked = screen.queryAllByTestId("artworkListItemUnselectedIcon")
        const checked = screen.queryAllByTestId("artworkListItemSelectedIcon")

        expect(options).toHaveLength(3)
        expect(checked).toHaveLength(0)
        expect(unchecked).toHaveLength(3)
        expect(screen.queryByTestId("artworkListItemSelectedIcon")).not.toBeOnTheScreen()

        fireEvent.press(screen.getByText("Custom Artwork List 2"))

        expect(screen.getByTestId("artworkListItemSelectedIcon")).toBeOnTheScreen()
      })

      it("unselect recently selected artwork lists", async () => {
        const { mockResolveLastOperation } = renderWithRelay()

        mockResolveLastOperation({
          Me: () => ({
            savedArtworksArtworkList: { ...savedArtworksArtworkList, isSavedArtwork: true },
            customArtworkLists,
          }),
        })

        await screen.findByText("Saved Artworks")

        // Select some custom artwork list
        fireEvent.press(screen.getByText("Custom Artwork List 2"))

        const options = screen.getAllByTestId("artworkListItem")
        const unchecked = screen.queryAllByTestId("artworkListItemUnselectedIcon")
        const checked = screen.queryAllByTestId("artworkListItemSelectedIcon")

        expect(options).toHaveLength(3)
        expect(checked).toHaveLength(2)
        expect(unchecked).toHaveLength(1)

        fireEvent.press(screen.getByText("Custom Artwork List 2"))

        expect(screen.getAllByTestId("artworkListItemSelectedIcon")).toHaveLength(1)
      })
    })

    describe("Artworks count", () => {
      it("should render `x Artwork` when one artwork was saved", async () => {
        const { mockResolveLastOperation } = renderWithRelay()

        mockResolveLastOperation({
          Me: () => ({
            savedArtworksArtworkList: { ...savedArtworksArtworkList, artworksCount: 1 },
            customArtworkLists: { edges: [] },
          }),
        })

        await screen.findByText("1 Artwork")
      })

      it("should render `x Artworks` when multiple artwork were saved", async () => {
        const { mockResolveLastOperation } = renderWithRelay()

        mockResolveLastOperation({
          Me: () => ({ savedArtworksArtworkList, customArtworkLists: { edges: [] } }),
        })

        await screen.findByText("5 Artworks")
      })
    })

    describe("Selected artwork lists counter", () => {
      describe("without selected artwork lists by default", () => {
        it("default state", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          mockResolveLastOperation({
            Me: () => ({ savedArtworksArtworkList, customArtworkLists, artworkLists }),
          })

          expect(screen.getByText("0 lists selected")).toBeOnTheScreen()
        })

        it("selected one artwork list", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          mockResolveLastOperation({
            Me: () => ({ savedArtworksArtworkList, customArtworkLists, artworkLists }),
          })

          await screen.findByText("Saved Artworks")
          fireEvent.press(screen.getByText("Saved Artworks"))

          expect(screen.getByText("1 list selected")).toBeOnTheScreen()
        })

        it("selected multiple artwork lists", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          mockResolveLastOperation({
            Me: () => ({ savedArtworksArtworkList, customArtworkLists, artworkLists }),
          })

          await screen.findByText("Saved Artworks")
          fireEvent.press(screen.getByText("Saved Artworks"))
          fireEvent.press(screen.getByText("Custom Artwork List 1"))

          expect(screen.getByText("2 lists selected")).toBeOnTheScreen()
        })

        it("selected multiple artwork lists (select and unselect action)", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          mockResolveLastOperation({
            Me: () => ({ savedArtworksArtworkList, customArtworkLists, artworkLists }),
          })

          await screen.findByText("Saved Artworks")
          fireEvent.press(screen.getByText("Saved Artworks"))
          fireEvent.press(screen.getByText("Custom Artwork List 1"))
          expect(screen.getByText("2 lists selected")).toBeOnTheScreen()

          fireEvent.press(screen.getByText("Saved Artworks"))
          expect(screen.getByText("1 list selected")).toBeOnTheScreen()
        })
      })

      describe("with selected artwork lists by default", () => {
        it("default state", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          mockResolveLastOperation({
            Me: () => ({
              savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
              customArtworkLists: preselectedCustomArtworkLists,
              artworkLists: preselectedArtworkLists,
            }),
          })

          await screen.findByText("3 lists selected")
        })

        it("unselect preselected artwork lists", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          mockResolveLastOperation({
            Me: () => ({
              savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
              customArtworkLists: preselectedCustomArtworkLists,
              artworkLists: preselectedArtworkLists,
            }),
          })

          await screen.findByText("Saved Artworks")
          fireEvent.press(screen.getByText("Saved Artworks"))
          fireEvent.press(screen.getByText("Custom Artwork List 1"))

          expect(screen.getByText("1 list selected")).toBeOnTheScreen()
        })

        it("unselect preselected and select again the same artwork lists", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          mockResolveLastOperation({
            Me: () => ({
              savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
              customArtworkLists: preselectedCustomArtworkLists,
              artworkLists: preselectedArtworkLists,
            }),
          })

          await screen.findByText("Saved Artworks")
          fireEvent.press(screen.getByText("Saved Artworks"))
          fireEvent.press(screen.getByText("Custom Artwork List 1"))
          expect(screen.getByText("1 list selected")).toBeOnTheScreen()

          fireEvent.press(screen.getByText("Saved Artworks"))
          fireEvent.press(screen.getByText("Custom Artwork List 1"))
          expect(screen.getByText("3 lists selected")).toBeOnTheScreen()
        })

        it("unselect preselected and select other artwork lists", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          mockResolveLastOperation({
            Me: () => ({
              savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
              customArtworkLists: preselectedCustomArtworkLists,
              artworkLists: preselectedArtworkLists,
            }),
          })

          await screen.findByText("Saved Artworks")

          fireEvent.press(screen.getByText("Saved Artworks"))
          fireEvent.press(screen.getByText("Custom Artwork List 1"))
          expect(screen.getByText("1 list selected")).toBeOnTheScreen()

          fireEvent.press(screen.getByText("Custom Artwork List 3"))
          expect(screen.getByText("2 lists selected")).toBeOnTheScreen()
        })
      })
    })
  })

  describe("Update artwork list offers settings", () => {
    const renderOfferSettings = (mockResolvers?: any, props?: any) => {
      initialStateSpy.mockReturnValue({
        ...utils.ARTWORK_LISTS_STORE_INITIAL_STATE,
        artworkListOfferSettingsViewVisible: true,
        selectArtworkListsViewVisible: false,
        ...props,
      })
      return renderWithRelay(mockResolvers)
    }

    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworkListOfferability: true })
    })

    it("should not be displayed by default", () => {
      renderOfferSettings({}, { artwork: null, artworkListOfferSettingsViewVisible: false })

      expect(screen.queryByText("Offer Settings")).not.toBeOnTheScreen()
    })

    it("should display the artwork lists", async () => {
      const { mockResolveLastOperation } = renderOfferSettings()

      mockResolveLastOperation({ Me: () => ({ savedArtworksArtworkList, customArtworkLists }) })

      await screen.findByText("Offer Settings")
      await screen.findByText("Saved Artworks")

      expect(screen.getByText("Offer Settings")).toBeOnTheScreen()

      expect(screen.getByText("Saved Artworks")).toBeOnTheScreen()
      expect(screen.getByText("Custom Artwork List 1")).toBeOnTheScreen()
      expect(screen.getByText("Custom Artwork List 2")).toBeOnTheScreen()

      expect(screen.getByLabelText("HideIcon")).toBeOnTheScreen()
    })

    describe("Share/unshare artwork lists", () => {
      it("all artwork lists should be unshared", async () => {
        const { mockResolveLastOperation } = renderOfferSettings()

        mockResolveLastOperation({ Me: () => ({ savedArtworksArtworkList, customArtworkLists }) })

        await screen.findByText("Saved Artworks")

        expect(screen.getAllByLabelText("HideIcon").length).toEqual(1)

        // SavedArtworks and Custom Artwork List 1 are shared
        // Custom Artwork List 2 is not shared
        const [savedArtworks, custom1, custom2] = screen.getAllByRole("switch")

        // Unshare all
        fireEvent(savedArtworks, "valueChange", true)
        fireEvent(custom1, "valueChange", true)

        expect(screen.getAllByLabelText("HideIcon").length).toEqual(3)

        // Share again
        fireEvent(savedArtworks, "valueChange", false)
        fireEvent(custom1, "valueChange", false)
        fireEvent(custom2, "valueChange", true)

        expect(screen.queryAllByLabelText("HideIcon").length).toEqual(0)
      })
    })
  })
})

const savedArtworksArtworkList = {
  internalID: "saved-artworks",
  name: "Saved Artworks",
  isSavedArtwork: false,
  artworksCount: 5,
  shareableWithPartners: true,
}

const customArtworkListOne = {
  internalID: "custom-artwork-list-one",
  name: "Custom Artwork List 1",
  isSavedArtwork: false,
  artworksCount: 1,
  shareableWithPartners: true,
}

const customArtworkListTwo = {
  internalID: "custom-artwork-list-two",
  name: "Custom Artwork List 2",
  isSavedArtwork: false,
  artworksCount: 2,
  shareableWithPartners: false,
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
        shareableWithPartners: false,
      },
    },
  ],
}

const artworkLists = {
  totalCount: 0,
}

const preselectedArtworkLists = {
  totalCount: 3,
}

const artworkEntity: ArtworkEntity = {
  id: "artwork-id",
  internalID: "artwork-internal-id",
  isInAuction: false,
  title: "Artwork Title",
  year: "2023",
  artistNames: "Banksy",
  imageURL: null,
}
