import { addCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionTestsQuery } from "__generated__/MyCollectionTestsQuery.graphql"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { extractText } from "lib/tests/extractText"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestRenderer } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionContainer } from "./MyCollection"
import { MyCollectionArtworkFormModal } from "./Screens/ArtworkFormModal/MyCollectionArtworkFormModal"

jest.unmock("react-relay")

describe("MyCollection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
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
          return <MyCollectionContainer me={props.me} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
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
      expect(extractText(tree.root)).toContain("Your art collection in your pocket.")
      expect(extractText(tree.root)).toContain("Keep track of your collection all in one place and get market insights")
    })

    it("shows form modal when Add Artwork is pressed", () => {
      const addArtworkButton = tree.root.findByProps({ testID: "add-artwork-button-zero-state" })
      addArtworkButton.props.onPress()

      const artworkModal = tree.root.findByType(MyCollectionArtworkFormModal)
      expect(artworkModal).toBeDefined()
      expect(artworkModal.props.visible).toBeTruthy()
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
