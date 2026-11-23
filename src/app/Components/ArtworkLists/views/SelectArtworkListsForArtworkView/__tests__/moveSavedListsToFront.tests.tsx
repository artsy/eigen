import { screen, within } from "@testing-library/react-native"
import { moveSavedListsToFrontTestsQuery } from "__generated__/moveSavedListsToFrontTestsQuery.graphql"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { ArtworkLists } from "app/Components/ArtworkLists/components/ArtworkLists"
import { getArtworkListsStoreInitialState } from "app/Components/ArtworkLists/types"
import { moveSavedListsToFront } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useUpdateArtworkListsForArtwork"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { commitLocalUpdate, graphql } from "react-relay"
import { act } from "react-test-renderer"

const expectOrder = (names: string[]) => {
  const rows = screen.getAllByTestId("artworkListItem")
  expect(rows).toHaveLength(names.length)
  names.forEach((name, index) => {
    expect(within(rows[index]).getByText(name)).toBeOnTheScreen()
  })
}

const { renderWithRelay } = setupTestWrapper<moveSavedListsToFrontTestsQuery>({
  Component: ({ me }: any) => (
    <ArtworkListsStore.Provider runtimeModel={{ state: { ...getArtworkListsStoreInitialState() } }}>
      <ArtworkLists me={me} />
    </ArtworkListsStore.Provider>
  ),
  query: graphql`
    query moveSavedListsToFrontTestsQuery @relay_test_operation {
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

describe("moveSavedListsToFront", () => {
  it("moves a just-saved list to the front of the connection", () => {
    const { env } = renderWithRelay(twoCustomLists)

    expectOrder(["List A", "List B"])

    act(() => {
      commitLocalUpdate(env, (store) => {
        moveSavedListsToFront(store, [{ internalID: "list-b", default: false }] as any)
      })
    })

    expectOrder(["List B", "List A"])
  })

  it("leaves order untouched when nothing custom was added", () => {
    const { env } = renderWithRelay(twoCustomLists)

    act(() => {
      commitLocalUpdate(env, (store) => {
        // Only the default "Saved Artworks" list changed — not part of this connection.
        moveSavedListsToFront(store, [{ internalID: "saved-artwork", default: true }] as any)
      })
    })

    expectOrder(["List A", "List B"])
  })
})
