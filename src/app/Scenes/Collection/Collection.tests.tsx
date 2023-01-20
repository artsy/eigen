import { CollectionTestsQuery } from "__generated__/CollectionTestsQuery.graphql"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { CollectionContainer } from "./Collection"

jest.unmock("react-relay")

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
      variables={{ hello: true }}
      render={({ props, error }) => {
        if (props) {
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          return <CollectionContainer collection={props.marketingCollection} />
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
    const { queryByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(environment, {
      MarketingCollection: () => ({
        ...mockedCollection,
        featuredArtistExclusionIds: [],
        query: {
          artistIDs: [],
        },
      }),
    })

    expect(queryByText("Featured Artists")).toBeTruthy()
  })

  it("should hide the Featured artists section when showFeaturedArtists is false", () => {
    const { queryByText } = renderWithWrappers(<TestRenderer />)

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

    expect(queryByText("Featured Artists")).toBeFalsy()
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
