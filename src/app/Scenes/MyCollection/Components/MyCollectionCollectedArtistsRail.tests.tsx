import { MyCollectionCollectedArtistsRailTestsQuery } from "__generated__/MyCollectionCollectedArtistsRailTestsQuery.graphql"
import { MyCollectionCollectedArtistsRailPaginationContainer } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsRail"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("MyCollectionCollectedArtistsRail", () => {
  let environment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    environment = createMockEnvironment()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<MyCollectionCollectedArtistsRailTestsQuery>
        environment={environment}
        query={graphql`
          query MyCollectionCollectedArtistsRailTestsQuery @relay_test_operation {
            me {
              myCollectionInfo {
                includesPurchasedArtworks
                artistsCount
                artworksCount
                ...MyCollectionCollectedArtistsRail_myCollectionInfo
              }
            }
          }
        `}
        render={({ props }) => {
          if (!props?.me?.myCollectionInfo) {
            return null
          }
          return (
            <MyCollectionCollectedArtistsRailPaginationContainer
              myCollectionInfo={props.me.myCollectionInfo}
            />
          )
        }}
        variables={{}}
      />
    )
  }

  it("renders without throwing an error", () => {
    renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(environment)
  })

  it("renders collected artist", async () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(environment, {
      MyCollectionInfo() {
        return mockCollectedArtist
      },
    })

    await expect(getByText("Rhombie Sandoval")).toBeTruthy()
  })
})

const mockCollectedArtist = {
  collectedArtistsConnection: {
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
    ],
  },
}
