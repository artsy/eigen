import { ArtworkListTestsQuery } from "__generated__/ArtworkListTestsQuery.graphql"
import { ArtworkList } from "app/Scenes/ArtworkList/ArtworkList"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { Suspense } from "react"
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
      render={() => {
        return (
          <Suspense fallback={null}>
            <ArtworkList listID="some-id" />
          </Suspense>
        )
      }}
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
      Query: () => mockResponse,
    })

    await flushPromiseQueue()

    expect(getByText("Saved Artworks")).toBeTruthy()
    expect(getByText("20 Artworks")).toBeTruthy()
  })
})

const mockResponse = {
  me: {
    artworkList: {
      internalID: "id-1",
      name: "Saved Artworks",
      artworks: {
        totalCount: 20,
      },
    },
  },
}
