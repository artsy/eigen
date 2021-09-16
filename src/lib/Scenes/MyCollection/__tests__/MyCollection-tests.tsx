import { addCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionTestsQuery } from "__generated__/MyCollectionTestsQuery.graphql"
import MyCollectionGrid from "lib/Components/ArtworkGrids/MyCollectionArtworkGrid"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestRenderer } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionContainer } from "../MyCollection"
import { MyCollectionArtworkFormModal } from "../Screens/ArtworkFormModal/MyCollectionArtworkFormModal"

jest.unmock("react-relay")
jest.mock("react-tracking")

describe("MyCollection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const trackEvent = jest.fn()
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
    const mockTracking = useTracking as jest.Mock
    mockTracking.mockImplementation(() => {
      return {
        trackEvent,
      }
    })
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
      expect(extractText(tree.root)).toContain("Primed and ready for artworks.")
      expect(extractText(tree.root)).toContain("Add a work from your collection to access price and market insights")
    })

    it("shows form modal when Add Artwork is pressed", () => {
      const addArtworkButton = tree.root.findByProps({ "data-test-id": "add-artwork-button-zero-state" })
      addArtworkButton.props.onPress()

      const artworkModal = tree.root.findByType(MyCollectionArtworkFormModal)
      expect(artworkModal).toBeDefined()
      expect(artworkModal.props.visible).toBeTruthy()
    })

    it("tracks analytics event when Add Artwork is pressed", () => {
      const addArtworkButton = tree.root.findByProps({ "data-test-id": "add-artwork-button-zero-state" })
      addArtworkButton.props.onPress()

      expect(trackEvent).toHaveBeenCalledTimes(1)
      expect(trackEvent).toHaveBeenCalledWith(addCollectedArtwork())
    })
  })

  describe("collection is not empty", () => {
    let tree: ReactTestRenderer
    beforeEach(() => {
      tree = getWrapper()
    })

    it("renders without throwing an error", () => {
      expect(tree.root.findByType(StickyTabPageScrollView)).toBeDefined()
      expect(tree.root.findByType(MyCollectionGrid)).toBeDefined()
    })
  })
})
