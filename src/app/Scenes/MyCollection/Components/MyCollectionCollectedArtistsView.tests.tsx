import { screen } from "@testing-library/react-native"
import { MyCollectionCollectedArtistsViewTestsQuery } from "__generated__/MyCollectionCollectedArtistsViewTestsQuery.graphql"
import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
import { MyCollectionCollectedArtistsView } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsView"
import { MyCollectionTabsStoreProvider } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("MyCollectionCollectedArtistsView", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionCollectedArtistsViewTestsQuery>({
    Component: ({ me }) => (
      <MyCollectionArtworksKeywordStore.Provider>
        <MyCollectionTabsStoreProvider>
          <MyCollectionCollectedArtistsView me={me} />
        </MyCollectionTabsStoreProvider>
      </MyCollectionArtworksKeywordStore.Provider>
    ),
    query: graphql`
      query MyCollectionCollectedArtistsViewTestsQuery @relay_test_operation {
        me @required(action: NONE) {
          ...MyCollectionCollectedArtistsView_me
        }
      }
    `,
  })

  it("renders collected artists", async () => {
    renderWithRelay({ Me: () => mockUserInterest })

    await expect(screen.getByText("Rhombie Sandoval")).toBeTruthy()
    await expect(screen.getByText("Banksy")).toBeTruthy()
  })

  it("renders the privacy lock next to the artist name", async () => {
    renderWithRelay({ Me: () => mockUserInterest })

    await expect(screen.getAllByTestId("lock-icon")).toHaveLength(2)
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
