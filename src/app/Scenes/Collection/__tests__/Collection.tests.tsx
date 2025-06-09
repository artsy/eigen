import { screen } from "@testing-library/react-native"
import { CollectionTestsQuery } from "__generated__/CollectionTestsQuery.graphql"
import { CollectionContent } from "app/Scenes/Collection/Collection"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("Collection", () => {
  let environment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<CollectionTestsQuery>
      environment={environment}
      query={graphql`
        query CollectionTestsQuery @relay_test_operation {
          marketingCollection(slug: "doesn't matter") {
            ...Collection_collection
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props) {
          return <CollectionContent collection={props.marketingCollection!} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    environment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should show the Featured artists section when showFeaturedArtists is true", () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(environment, {
      MarketingCollection: () => ({
        ...mockedCollection,
        featuredArtistExclusionIds: [],
        query: {
          artistIDs: [],
        },
      }),
    })

    expect(screen.getByText("Featured Artists")).toBeTruthy()
  })

  it("should hide the Featured artists section when showFeaturedArtists is false", () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(environment, {
      MarketingCollection: () => ({
        ...mockedCollection,
        showFeaturedArtists: false,
        featuredArtistExclusionIds: [],
        query: {
          artistIDs: [],
        },
      }),
    })

    expect(screen.queryByText("Featured Artists")).toBeFalsy()
  })
})

const mockedCollection = {
  showFeaturedArtists: true,
  artworksConnection: {
    merchandisableArtists: [
      {
        slug: "banksy",
        name: "Banksy",
        href: "/artist/banksy",
      },
      {
        slug: "keith-haring",
        name: "Keith Haring",
        href: "/artist/keith-haring",
      },
      {
        slug: "retna",
        name: "RETNA",
        initials: "R",
        href: "/artist/retna",
      },
    ],
  },
}
