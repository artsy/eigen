import { fireEvent } from "@testing-library/react-native"
import { NewMyCollectionArtworkHeaderTestQuery } from "__generated__/NewMyCollectionArtworkHeaderTestQuery.graphql"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionArtworkHeader } from "./NewMyCollectionArtworkHeader"

jest.unmock("react-relay")

describe("NewMyCollectionArtworkHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<NewMyCollectionArtworkHeaderTestQuery>
      environment={mockEnvironment}
      query={graphql`
        query NewMyCollectionArtworkHeaderTestQuery @relay_test_operation {
          artwork(id: "artwork-id") {
            ...NewMyCollectionArtworkHeader_artwork
          }
        }
      `}
      render={({ props }) => {
        if (props?.artwork) {
          return <MyCollectionArtworkHeader artwork={props.artwork} />
        }
        return null
      }}
      variables={{}}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const renderer = renderWithWrappersTL(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment, mockResolvers)
    return renderer
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders without throwing an error", () => {
    const { getByText } = getWrapper({
      Artwork: () => ({
        artistNames: "some artist name",
        date: "Jan 20th",
        image: {
          url: "some/url",
        },
        title: "some title",
      }),
    })

    expect(getByText("some artist name")).toBeTruthy()
    expect(getByText("some title, Jan 20th")).toBeTruthy()
  })

  it("fires the analytics tracking event when image is pressed", () => {
    const { getByTestId } = getWrapper({
      Artwork: () => ({
        internalID: "someInternalId",
        slug: "someSlug",
      }),
    })

    const carouselImage = getByTestId("image-with-loading-state")
    fireEvent(carouselImage, "Press")
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action_name: "artworkImageZoom",
      action_type: "tap",
      context_module: "ArtworkImage",
    })
  })

  it("shows fallback view when images are null", () => {
    const { getByTestId } = getWrapper({
      Artwork: () => ({
        artistNames: "names",
        date: new Date().toISOString(),
        images: null,
        internalID: "internal-id",
        title: "a title",
        slug: "some-slug",
      }),
    })

    const fallbackView = getByTestId("Fallback-image-mycollection-header")
    expect(fallbackView).toBeDefined()
  })
})
