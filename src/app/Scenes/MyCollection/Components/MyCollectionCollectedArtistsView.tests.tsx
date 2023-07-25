import { MyCollectionCollectedArtistsViewTestsQuery } from "__generated__/MyCollectionCollectedArtistsViewTestsQuery.graphql"
import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
import { MyCollectionCollectedArtistsView } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsView"
import { MyCollectionTabsStoreProvider } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("MyCollectionCollectedArtistsView", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    return (
      <MyCollectionArtworksKeywordStore.Provider>
        <MyCollectionTabsStoreProvider>
          <QueryRenderer<MyCollectionCollectedArtistsViewTestsQuery>
            environment={mockEnvironment}
            query={graphql`
              query MyCollectionCollectedArtistsViewTestsQuery @relay_test_operation {
                me {
                  ...MyCollectionCollectedArtistsView_me
                }
              }
            `}
            render={({ props }) => {
              if (!props?.me) {
                return null
              }
              return <MyCollectionCollectedArtistsView me={props.me} />
            }}
            variables={{}}
          />
        </MyCollectionTabsStoreProvider>
      </MyCollectionArtworksKeywordStore.Provider>
    )
  }

  it("renders collected artist in a list", async () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Me() {
        return mockUserInterest
      },
    })

    __globalStoreTestUtils__?.injectState({
      userPrefs: { artworkViewOption: "list" },
    })
    await expect(__globalStoreTestUtils__?.getCurrentState().userPrefs.artworkViewOption).toEqual(
      "list"
    )

    await expect(getByText("Rhombie Sandoval")).toBeTruthy()
    await expect(getByText("Banksy")).toBeTruthy()
  })

  it("renders collected artist in a grid", async () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Me() {
        return mockUserInterest
      },
    })

    __globalStoreTestUtils__?.injectState({
      userPrefs: { artworkViewOption: "grid" },
    })
    await expect(__globalStoreTestUtils__?.getCurrentState().userPrefs.artworkViewOption).toEqual(
      "grid"
    )

    await expect(getByText("Rhombie Sandoval")).toBeTruthy()
    await expect(getByText("Banksy")).toBeTruthy()
  })

  it("renders the privacy lock next to the artist name", async () => {
    const { getAllByTestId } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Me() {
        return mockUserInterest
      },
    })

    await expect(getAllByTestId("lock-icon")).toHaveLength(2)
  })
})

const mockUserInterest = {
  userInterestsConnection: {
    edges: [
      {
        private: true,
        node: {
          internalID: "5f112c5876efda000e68f3a9",
          name: "Rhombie Sandoval",
          initials: "RS",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/9fBwpcL2aMa2YyBEzol8Yg/square.jpg",
          },
        },
      },
      {
        private: true,
        node: {
          internalID: "5f112c5876efda000e68f3a9",
          name: "Banksy",
          initials: "RS",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/9fBwpcL2aMa2YyBEzol8Yg/square.jpg",
          },
        },
      },
    ],
  },
}
