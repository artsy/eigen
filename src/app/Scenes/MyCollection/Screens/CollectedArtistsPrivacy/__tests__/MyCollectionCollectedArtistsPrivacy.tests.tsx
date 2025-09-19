import { screen } from "@testing-library/react-native"
import { MyCollectionCollectedArtistsPrivacyQuery } from "__generated__/MyCollectionCollectedArtistsPrivacyQuery.graphql"
import { MyCollectionCollectedArtistsPrivacyQueryRenderer } from "app/Scenes/MyCollection/Screens/CollectedArtistsPrivacy/MyCollectionCollectedArtistsPrivacy"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { times } from "lodash"
import { graphql } from "react-relay"

describe("MyCollectionCollectedArtistsPrivacy", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionCollectedArtistsPrivacyQuery>({
    Component: MyCollectionCollectedArtistsPrivacyQueryRenderer,
    query: graphql`
      query MyCollectionCollectedArtistsPrivacy_Test_Query @relay_test_operation {
        me {
          ...MyCollectionCollectedArtistsPrivacyArtistsList_me
        }
      }
    `,
  })

  it("shows a list of collected artists", async () => {
    renderWithRelay({
      Me: () => ({
        userInterestsConnection: {
          edges: times(5).map((i) => ({
            internalID: `interest-${i + 1}`,
            private: i % 2 === 0,
            node: {
              __typename: "Artist",
              internalID: `artist-${i + 1}`,
              name: `Artist ${i + 1}`,
            },
          })),
        },
      }),
    })

    expect(await screen.findByText("Artist 1")).toBeTruthy()
    expect(screen.getByText("Artist 2")).toBeTruthy()
    expect(screen.getByText("Artist 3")).toBeTruthy()
    expect(screen.getByText("Artist 4")).toBeTruthy()
    expect(screen.getByText("Artist 5")).toBeTruthy()
  })
})
