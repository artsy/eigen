import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ArtworkListsContextTestQuery } from "__generated__/ArtworkListsContextTestQuery.graphql"
import { ArtworkListsProvider } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkEntity } from "app/Components/ArtworkLists/types"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@gorhom/bottom-sheet", () => require("@gorhom/bottom-sheet/mock"))

describe("ArtworkListsProvider", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkListsContextTestQuery>({
    Component: (props: any) => (
      <ArtworkListsProvider
        artwork={props?.artwork ?? artworkEntity}
        selectArtworkListsViewVisible={props?.selectArtworkListsViewVisible ?? true}
        {...props}
      />
    ),
    query: graphql`
      query ArtworkListsContextTestQuery @relay_test_operation {
        ...ArtworkLists_collectionsConnection
      }
    `,
  })

  describe("Select lists for artwork", () => {
    it("should not be displayed by default", () => {
      renderWithRelay({}, { artwork: null })

      expect(
        screen.queryByText("Select where you’d like to save this artwork:")
      ).not.toBeOnTheScreen()
    })

    it("should be displayed when artwork is set", () => {
      renderWithRelay()

      expect(screen.getByText("Select where you’d like to save this artwork:")).toBeOnTheScreen()
    })

    // TODO: Fix this test, it's failing because footerComponent (in SelectArtworkListsForArtworkView) is not being rendered
    it.skip("should display `Done` button", () => {
      renderWithRelay()

      expect(screen.getByText("Done")).toBeOnTheScreen()
    })

    it("should display artwork lists", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      await waitFor(() =>
        mockResolveLastOperation({ Me: () => ({ savedArtworksArtworkList, customArtworkLists }) })
      )

      expect(screen.getByText("Saved Artworks")).toBeOnTheScreen()
      expect(screen.getByText("Custom Artwork List 1")).toBeOnTheScreen()
      expect(screen.getByText("Custom Artwork List 2")).toBeOnTheScreen()
    })

    it("should navigate to the create new artwork list flow when button is pressed", () => {
      renderWithRelay()

      fireEvent.press(screen.getByText("Create New List"))

      expect(screen.getByText("Create a new list")).toBeOnTheScreen()
    })

    describe("Selected/unselected artwork lists state", () => {
      it("all artwork lists should be unselected", async () => {
        const { mockResolveLastOperation } = renderWithRelay()

        await waitFor(() =>
          mockResolveLastOperation({ Me: () => ({ savedArtworksArtworkList, customArtworkLists }) })
        )

        const selected = screen.queryAllByA11yState({ selected: true })
        expect(selected).toHaveLength(0)
      })

      it("recently selected artwork lists should be preselected by default", async () => {
        const { mockResolveLastOperation } = renderWithRelay()

        await waitFor(() =>
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
        )

        const selected = screen.queryAllByA11yState({ selected: true })
        expect(selected).toHaveLength(2)
      })

      it("add selected state when artwork list is pressed", async () => {
        const { mockResolveLastOperation } = renderWithRelay()

        await waitFor(() =>
          mockResolveLastOperation({ Me: () => ({ savedArtworksArtworkList, customArtworkLists }) })
        )

        const selectedBefore = screen.queryAllByA11yState({ selected: true })
        expect(selectedBefore).toHaveLength(0)

        fireEvent.press(screen.getByText("Custom Artwork List 2"))

        const selectedAfter = screen.queryAllByA11yState({ selected: true })
        expect(selectedAfter).toHaveLength(1)
      })

      it("unselect recently selected artwork lists", async () => {
        const { mockResolveLastOperation } = renderWithRelay()

        await waitFor(() =>
          mockResolveLastOperation({
            Me: () => ({
              savedArtworksArtworkList: { ...savedArtworksArtworkList, isSavedArtwork: true },
              customArtworkLists,
            }),
          })
        )

        // Select some custom artwork list
        fireEvent.press(screen.getByText("Custom Artwork List 2"))

        const selectedBefore = screen.queryAllByA11yState({ selected: true })
        expect(selectedBefore).toHaveLength(2)

        // Unselect all
        fireEvent.press(screen.getByText("Saved Artworks"))
        fireEvent.press(screen.getByText("Custom Artwork List 2"))

        const selectedAfter = screen.queryAllByA11yState({ selected: true })
        expect(selectedAfter).toHaveLength(0)
      })
    })

    describe("Artworks count", () => {
      it("should render `x Artwork` when one artwork was saved", async () => {
        const { mockResolveLastOperation } = renderWithRelay()

        await waitFor(() =>
          mockResolveLastOperation({
            Me: () => ({
              savedArtworksArtworkList: { ...savedArtworksArtworkList, artworksCount: 1 },
              customArtworkLists: { edges: [] },
            }),
          })
        )

        expect(screen.getByText("1 Artwork")).toBeOnTheScreen()
      })

      it("should render `x Artworks` when multiple artwork were saved", async () => {
        const { mockResolveLastOperation } = renderWithRelay()

        await waitFor(() =>
          mockResolveLastOperation({
            Me: () => ({ savedArtworksArtworkList, customArtworkLists: { edges: [] } }),
          })
        )

        expect(screen.getByText("5 Artworks")).toBeOnTheScreen()
      })
    })

    describe("Selected artwork lists counter", () => {
      describe("without selected artwork lists by default", () => {
        it("default state", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          await waitFor(() =>
            mockResolveLastOperation({
              Me: () => ({ savedArtworksArtworkList, customArtworkLists, artworkLists }),
            })
          )

          expect(screen.getByText("0 lists selected")).toBeOnTheScreen()
        })

        it("selected one artwork list", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          await waitFor(() =>
            mockResolveLastOperation({
              Me: () => ({ savedArtworksArtworkList, customArtworkLists, artworkLists }),
            })
          )

          fireEvent.press(screen.getByText("Saved Artworks"))

          expect(screen.getByText("1 list selected")).toBeOnTheScreen()
        })

        it("selected multiple artwork lists", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          await waitFor(() =>
            mockResolveLastOperation({
              Me: () => ({ savedArtworksArtworkList, customArtworkLists, artworkLists }),
            })
          )

          fireEvent.press(screen.getByText("Saved Artworks"))
          fireEvent.press(screen.getByText("Custom Artwork List 1"))

          expect(screen.getByText("2 lists selected")).toBeOnTheScreen()
        })

        it("selected multiple artwork lists (select and unselect action)", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          await waitFor(() =>
            mockResolveLastOperation({
              Me: () => ({ savedArtworksArtworkList, customArtworkLists, artworkLists }),
            })
          )

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

          await waitFor(() =>
            mockResolveLastOperation({
              Me: () => ({
                savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
                customArtworkLists: preselectedCustomArtworkLists,
                artworkLists: preselectedArtworkLists,
              }),
            })
          )

          expect(screen.getByText("3 lists selected")).toBeOnTheScreen()
        })

        it("unselect preselected artwork lists", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          await waitFor(() =>
            mockResolveLastOperation({
              Me: () => ({
                savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
                customArtworkLists: preselectedCustomArtworkLists,
                artworkLists: preselectedArtworkLists,
              }),
            })
          )

          fireEvent.press(screen.getByText("Saved Artworks"))
          fireEvent.press(screen.getByText("Custom Artwork List 1"))

          expect(screen.getByText("1 list selected")).toBeOnTheScreen()
        })

        it("unselect preselected and select again the same artwork lists", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          await waitFor(() =>
            mockResolveLastOperation({
              Me: () => ({
                savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
                customArtworkLists: preselectedCustomArtworkLists,
                artworkLists: preselectedArtworkLists,
              }),
            })
          )

          fireEvent.press(screen.getByText("Saved Artworks"))
          fireEvent.press(screen.getByText("Custom Artwork List 1"))
          expect(screen.getByText("1 list selected")).toBeOnTheScreen()

          fireEvent.press(screen.getByText("Saved Artworks"))
          fireEvent.press(screen.getByText("Custom Artwork List 1"))
          expect(screen.getByText("3 lists selected")).toBeOnTheScreen()
        })

        it("unselect preselected and select other artwork lists", async () => {
          const { mockResolveLastOperation } = renderWithRelay()

          await waitFor(() =>
            mockResolveLastOperation({
              Me: () => ({
                savedArtworksArtworkList: preselectedSavedArtworksArtworkList,
                customArtworkLists: preselectedCustomArtworkLists,
                artworkLists: preselectedArtworkLists,
              }),
            })
          )

          fireEvent.press(screen.getByText("Saved Artworks"))
          fireEvent.press(screen.getByText("Custom Artwork List 1"))
          expect(screen.getByText("1 list selected")).toBeOnTheScreen()

          fireEvent.press(screen.getByText("Custom Artwork List 3"))
          expect(screen.getByText("2 lists selected")).toBeOnTheScreen()
        })
      })
    })

    // TODO: Fix this test, it's failing because footerComponent (in SelectArtworkListsForArtworkView) is not being rendered
    describe.skip("Done button", () => {
      it("enabled by default", async () => {
        const { mockResolveLastOperation } = renderWithRelay()

        await waitFor(() =>
          mockResolveLastOperation({ Me: () => ({ savedArtworksArtworkList, customArtworkLists }) })
        )

        expect(screen.getByText("Done")).toBeEnabled()
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

const artworkLists = {
  totalCount: 0,
}

const preselectedArtworkLists = {
  totalCount: 3,
}

const artworkEntity: ArtworkEntity = {
  id: "artwork-id",
  internalID: "artwork-internal-id",
  title: "Artwork Title",
  year: "2023",
  artistNames: "Banksy",
  imageURL: null,
}
