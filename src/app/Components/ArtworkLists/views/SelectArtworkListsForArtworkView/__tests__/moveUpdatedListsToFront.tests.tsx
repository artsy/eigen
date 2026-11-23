import { act, screen, within } from "@testing-library/react-native"
import { moveUpdatedListsToFrontTestsQuery } from "__generated__/moveUpdatedListsToFrontTestsQuery.graphql"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { ArtworkLists } from "app/Components/ArtworkLists/components/ArtworkLists"
import { getArtworkListsStoreInitialState } from "app/Components/ArtworkLists/types"
import { moveUpdatedListsToFront } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useUpdateArtworkListsForArtwork"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { commitLocalUpdate, graphql } from "react-relay"

const expectOrder = (names: string[]) => {
  const rows = screen.getAllByTestId("artworkListItem")
  expect(rows).toHaveLength(names.length)
  names.forEach((name, index) => {
    expect(within(rows[index]).getByText(name)).toBeOnTheScreen()
  })
}

const { renderWithRelay } = setupTestWrapper<moveUpdatedListsToFrontTestsQuery>({
  Component: ({ me }: any) => (
    <ArtworkListsStore.Provider runtimeModel={{ state: { ...getArtworkListsStoreInitialState() } }}>
      <ArtworkLists me={me} />
    </ArtworkListsStore.Provider>
  ),
  query: graphql`
    query moveUpdatedListsToFrontTestsQuery @relay_test_operation {
      me {
        ...ArtworkLists_me @arguments(artworkID: "artwork-id")
      }
    }
  `,
})

const twoCustomLists = {
  Me: () => ({
    savedArtworksArtworkList: null,
    customArtworkLists: {
      edges: [
        { node: { id: "id-a", internalID: "list-a", name: "List A" } },
        { node: { id: "id-b", internalID: "list-b", name: "List B" } },
      ],
    },
  }),
}

describe("moveUpdatedListsToFront", () => {
  it("moves a list saved to, to the front of the connection", () => {
    const { env } = renderWithRelay(twoCustomLists)

    expectOrder(["List A", "List B"])

    act(() => {
      commitLocalUpdate(env, (store) => {
        moveUpdatedListsToFront(store, {
          addedToArtworkLists: [{ internalID: "list-b", default: false }],
        })
      })
    })

    expectOrder(["List B", "List A"])
  })

  it("moves a list removed from, to the front of the connection", () => {
    const { env } = renderWithRelay(twoCustomLists)

    expectOrder(["List A", "List B"])

    act(() => {
      commitLocalUpdate(env, (store) => {
        moveUpdatedListsToFront(store, {
          removedFromArtworkLists: [{ internalID: "list-b", default: false }],
        })
      })
    })

    expectOrder(["List B", "List A"])
  })

  it("leaves order untouched when only the default list changed", () => {
    const { env } = renderWithRelay(twoCustomLists)

    act(() => {
      commitLocalUpdate(env, (store) => {
        // The default "Saved Artworks" list isn't part of this connection.
        moveUpdatedListsToFront(store, {
          addedToArtworkLists: [{ internalID: "saved-artwork", default: true }],
        })
      })
    })

    expectOrder(["List A", "List B"])
  })
})
