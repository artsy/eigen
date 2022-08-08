import { addCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionTestsQuery } from "__generated__/MyCollectionTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"

import { navigate } from "app/navigation/navigate"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { ReactTestRenderer } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Tab } from "../MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { MyCollectionContainer } from "./MyCollection"

jest.unmock("react-relay")

describe("MyCollection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <ArtworkFiltersStoreProvider>
      <QueryRenderer<MyCollectionTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query MyCollectionTestsQuery @relay_test_operation {
            me {
              ...MyCollection_me
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.me) {
            return (
              <StickyTabPage
                tabs={[
                  {
                    title: "test",
                    content: <MyCollectionContainer me={props.me} />,
                  },
                ]}
              />
            )
          }
          return null
        }}
      />
    </ArtworkFiltersStoreProvider>
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()

    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableMyCollectionInsights: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers)
    )
    return tree
  }

  const getZeroStateWrapper = () =>
    getWrapper({
      Me: () => ({
        myCollectionConnection: {
          edges: [],
        },
      }),
    })

  describe("collection is empty", () => {
    let tree: ReactTestRenderer

    beforeEach(() => {
      tree = getZeroStateWrapper()
    })

    it("shows zerostate", () => {
      expect(extractText(tree.root)).toContain("Primed and ready for artworks.")
      expect(extractText(tree.root)).toContain(
        "Add works from your collection to access price and market insights."
      )
    })

    it("navigates to MyCollectionArtworkForm when Add Artwork is pressed", () => {
      const addArtworkButton = tree.root.findByProps({ testID: "add-artwork-button-zero-state" })
      addArtworkButton.props.onPress()

      expect(navigate).toHaveBeenCalledWith(
        "my-collection/artworks/new",
        expect.objectContaining({
          passProps: { mode: "add", onSuccess: expect.anything(), source: Tab.collection },
        })
      )
    })

    it("tracks analytics event when Add Artwork is pressed", () => {
      const addArtworkButton = tree.root.findByProps({ testID: "add-artwork-button-zero-state" })
      addArtworkButton.props.onPress()

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent).toHaveBeenCalledWith(addCollectedArtwork())
    })
  })

  describe("collection is not empty", () => {
    let tree: ReactTestRenderer
    beforeEach(() => {
      tree = getWrapper()
    })

    it("renders without throwing an error", () => {
      expect(tree.root.findByType(StickyTabPageScrollView)).toBeDefined()
      expect(tree.root.findByType(InfiniteScrollMyCollectionArtworksGridContainer)).toBeDefined()
    })
  })
})
