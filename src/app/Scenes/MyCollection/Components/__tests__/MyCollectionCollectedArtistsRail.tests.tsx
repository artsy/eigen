import { screen } from "@testing-library/react-native"
import { MyCollectionCollectedArtistsRailTestsQuery } from "__generated__/MyCollectionCollectedArtistsRailTestsQuery.graphql"
import { MyCollectionCollectedArtistsRail } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsRail"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("MyCollectionCollectedArtistsRail", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionCollectedArtistsRailTestsQuery>({
    Component: ({ me }) => {
      return (
        <MyCollectionTabsStore.Provider>
          <MyCollectionCollectedArtistsRail me={me} />
        </MyCollectionTabsStore.Provider>
      )
    },
    query: graphql`
      query MyCollectionCollectedArtistsRailTestsQuery @relay_test_operation {
        me @required(action: NONE) {
          ...MyCollectionCollectedArtistsRail_me
        }
      }
    `,
  })

  it("renders collected artist", async () => {
    renderWithRelay({ Me: () => mockCollectedArtist })

    expect(screen.getByText("Rhombie Sandoval")).toBeOnTheScreen()
    expect(screen.getByText("Banksy")).toBeOnTheScreen()
  })
})

const mockCollectedArtist = {
  userInterestsConnection: {
    edges: [
      {
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
