import { tappedCollectedArtworkImages } from "@artsy/cohesion"
import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import { MyCollectionArtworkHeaderTestsQuery } from "__generated__/MyCollectionArtworkHeaderTestsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ImageWithLoadingState } from "lib/Scenes/Artwork/Components/ImageCarousel/ImageWithLoadingState"
import { extractText } from "lib/tests/extractText"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers, renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionArtworkHeader, MyCollectionArtworkHeaderFragmentContainer } from "./MyCollectionArtworkHeader"

jest.unmock("react-relay")

describe("MyCollectionArtworkHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkHeaderTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkHeaderTestsQuery @relay_test_operation {
          artwork(id: "some-slug") {
            ...MyCollectionArtworkHeader_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <MyCollectionArtworkHeaderFragmentContainer artwork={props.artwork} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment, mockResolvers)
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper({
      Artwork: () => ({
        artistNames: "some artist name",
        date: "Jan 20th",
        image: {
          url: "some/url",
        },
        title: "some title",
      }),
    })

    const text = extractText(wrapper.root)
    expect(text).toContain("some artist name")
    expect(text).toContain("some title, Jan 20th")
    expect(wrapper.root.findAllByType(OpaqueImageView)).toBeDefined()
  })

  it("fires the analytics tracking event when image is pressed", () => {
    const wrapper = getWrapper({
      Artwork: () => ({
        internalID: "someInternalId",
        slug: "someSlug",
      }),
    })
    wrapper.root.findAllByType(ImageWithLoadingState)[0].props.onPress()
    // expect 2 calls: 1 for our custom tracking, 2 for tracking deep zoom taps
    expect(mockTrackEvent).toHaveBeenCalledTimes(2)
    expect(mockTrackEvent).toHaveBeenCalledWith(
      tappedCollectedArtworkImages({ contextOwnerId: "someInternalId", contextOwnerSlug: "someSlug" })
    )
  })

  it("shows fallback view when images are null", () => {
    const mockProps = {
      artistNames: "names",
      date: new Date().toISOString(),
      images: null,
      internalID: "internal-id",
      title: "a title",
      slug: "some-slug",
    } as MyCollectionArtworkHeader_artwork
    const { getByTestId } = renderWithWrappersTL(<MyCollectionArtworkHeader artwork={mockProps} />)
    const fallbackView = getByTestId("Fallback-image-mycollection-header")
    expect(fallbackView).toBeDefined()
  })
})
