import { act, fireEvent, screen } from "@testing-library/react-native"
import { AutosuggestResultsQuery } from "__generated__/AutosuggestResultsQuery.graphql"
import { MyCollectionAddCollectedArtistsScreen } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtists"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe.skip("MyCollectionAddCollectedArtists", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: MyCollectionAddCollectedArtistsScreen,
  })

  it("renders MyCollectionAddCollectedArtists", async () => {
    renderWithRelay()

    await flushPromiseQueue()

    expect(screen.getByPlaceholderText("Search for artists on Artsy")).toBeOnTheScreen()
  })

  it("adds collected artists by creating user interests", async () => {
    const { env } = renderWithRelay({
      Me: () => ({ userInterestsConnection: { edges: [] } }),
    })

    expect(screen.queryByText("Add Selected Artists • 0")).toBeDisabled()

    await flushPromiseQueue()

    fireEvent.changeText(screen.getByPlaceholderText("Search for artists on Artsy"), "banksy")

    act(() => {
      resolveMostRecentRelayOperation(env, { SearchableConnection: () => mockArtistSearchResult })
    })

    fireEvent.press(screen.getByText("Banksy"))

    fireEvent.press(screen.getByText("Add Selected Artist • 1"))

    await flushPromiseQueue()

    const mockOperations = env.mock.getAllOperations()

    const createUserInterestsOperation = mockOperations[0]
    expect(createUserInterestsOperation.request.variables).toMatchInlineSnapshot(`
        {
          "input": {
            "userInterests": [
              {
                "category": "COLLECTED_BEFORE",
                "interestId": "internal-id",
                "interestType": "ARTIST",
                "private": false,
              },
            ],
          },
        }
      `)

    resolveMostRecentRelayOperation(env, {})
    await flushPromiseQueue()

    expect(dismissModal).toHaveBeenCalledWith()
  })

  it("creates custom artists", async () => {
    const { env } = renderWithRelay({
      Me: () => ({ userInterestsConnection: { edges: [] } }),
    })

    expect(screen.queryByText("Add Selected Artists • 0")).toBeDisabled()

    await flushPromiseQueue()

    fireEvent.changeText(screen.getByPlaceholderText("Search for artists on Artsy"), "My Artist")

    act(() => {
      resolveMostRecentRelayOperation(env, { SearchableConnection: () => mockArtistSearchResult })
    })

    fireEvent.press(screen.getByText("Add their name."))

    expect(navigate).toHaveBeenCalledWith("/my-collection/artists/new", {
      passProps: { artistDisplayName: "My Artist", onSubmit: expect.any(Function) },
    })
  })
})

const mockArtistSearchResult: AutosuggestResultsQuery["rawResponse"]["results"] = {
  edges: [
    {
      cursor: "page-1",
      node: {
        __isNode: "SearchableItem",
        __typename: "SearchableItem",
        internalID: "internal-id",
        displayLabel: "Banksy",
        displayType: "Artist",
        href: "banksy-href",
        id: "banksy",
        imageUrl: "",
        slug: "banksy",
      },
    },
  ],
  pageInfo: {
    endCursor: "page-2",
    hasNextPage: true,
  },
}
