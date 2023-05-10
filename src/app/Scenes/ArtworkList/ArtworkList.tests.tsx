import { ArtworkListTestsQuery } from "__generated__/ArtworkListTestsQuery.graphql"
import { ArtworkList } from "app/Scenes/ArtworkList/ArtworkList"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { QueryRenderer, graphql } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("ArtworkList", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<ArtworkListTestsQuery>
      query={graphql`
        query ArtworkListTestsQuery($listID: String!, $count: Int) {
          me {
            ...ArtworkList_artworksConnection @arguments(listID: $listID, count: $count)
          }
        }
      `}
      render={() => <ArtworkList listID="some-id" />}
      variables={{ listID: "some-id", count: 10 }}
      environment={mockEnvironment}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders ArtworkList", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => me,
    })

    await flushPromiseQueue()

    expect(getByText("Saved Artworks")).toBeTruthy()
    expect(getByText("2 Artworks")).toBeTruthy()
  })

  it("displays the artworks", async () => {
    const { findByText } = renderWithHookWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => me,
    })

    await flushPromiseQueue()

    expect(findByText("Artwork Title 1")).toBeTruthy()
    expect(findByText("Artwork Title 2")).toBeTruthy()
  })
})

const me = {
  artworkList: {
    internalID: "id-1",
    name: "Saved Artworks",
    artworks: {
      totalCount: 2,
      edges: [
        {
          node: {
            title: "Artwork Title 1",
            internalID: "613a38d6611297000d7ccc1d",
          },
        },
        {
          node: {
            title: "Artwork Title 2",
            internalID: "614e4006f856a0000df1399c",
          },
        },
      ],
    },
  },
}
