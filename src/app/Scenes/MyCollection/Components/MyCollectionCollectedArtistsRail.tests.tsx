import { MyCollectionCollectedArtistsRailTestsQuery } from "__generated__/MyCollectionCollectedArtistsRailTestsQuery.graphql"
import { MyCollectionCollectedArtistsRail } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsRail"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("MyCollectionCollectedArtistsRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    return (
      <MyCollectionTabsStore.Provider>
        <QueryRenderer<MyCollectionCollectedArtistsRailTestsQuery>
          environment={mockEnvironment}
          query={graphql`
            query MyCollectionCollectedArtistsRailTestsQuery @relay_test_operation {
              me {
                ...MyCollectionCollectedArtistsRail_me
              }
            }
          `}
          render={({ props }) => {
            if (!props?.me) {
              return null
            }
            return <MyCollectionCollectedArtistsRail me={props.me} />
          }}
          variables={{}}
        />
      </MyCollectionTabsStore.Provider>
    )
  }

  it("renders collected artist", async () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Me() {
        return mockCollectedArtist
      },
    })

    await expect(getByText("Rhombie Sandoval")).toBeTruthy()
    await expect(getByText("Banksy")).toBeTruthy()
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
