import { tappedCollectedArtworkImages } from "@artsy/cohesion"
import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import { MyCollectionArtworkHeaderTestsQuery } from "__generated__/MyCollectionArtworkHeaderTestsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { postEventToProviders } from "lib/utils/track/providers"
import { ArtworkIcon } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionArtworkHeader, MyCollectionArtworkHeaderRefetchContainer } from "../MyCollectionArtworkHeader"

jest.unmock("react-relay")

let fakeRelay: {
  refetch: jest.Mock
  push: jest.Mock
}

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
          return <MyCollectionArtworkHeaderRefetchContainer artwork={props.artwork} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    fakeRelay = {
      refetch: jest.fn(),
    } as any
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
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

  it("navigates to images page when image is pressed", () => {
    const wrapper = getWrapper({
      Artwork: () => ({
        internalID: "1234",
      }),
    })
    wrapper.root.findAllByType(TouchableOpacity)[0].props.onPress()
    expect(navigate).toHaveBeenCalledWith("/my-collection/artwork-images/1234")
  })

  it("fires the analytics tracking event when image is pressed", () => {
    const wrapper = getWrapper({
      Artwork: () => ({
        internalID: "someInternalId",
        slug: "someSlug",
      }),
    })
    wrapper.root.findAllByType(TouchableOpacity)[0].props.onPress()
    expect(postEventToProviders).toHaveBeenCalledTimes(1)
    expect(postEventToProviders).toHaveBeenCalledWith(
      tappedCollectedArtworkImages({ contextOwnerId: "someInternalId", contextOwnerSlug: "someSlug" })
    )
  })

  it("shows a processing state when image data is incomplete", () => {
    const wrapper = getWrapper({
      Artwork: () => ({
        artistNames: "some artist name",
        date: "Jan 20th",
        images: [
          {
            url: "some/url",
            height: null,
            isDefault: true,
          },
        ],
        title: "some title",
      }),
    })
    expect(wrapper.root.findAllByType(OpaqueImageView)).toHaveLength(0)
    expect(wrapper.root.findByType(ArtworkIcon)).toBeDefined()
    expect(extractText(wrapper.root)).toContain("Processing photo")
  })

  it("polls for updated images when image data is incomplete", () => {
    const processingArtwork: MyCollectionArtworkHeader_artwork = {
      " $refType": "MyCollectionArtworkHeader_artwork",
      internalID: "some-id",
      slug: "some-slug",
      artistNames: "some artist name",
      date: "Jan 20th",
      images: [
        {
          imageURL: "some/url",
          height: null,
          width: null,
          isDefault: true,
          internalID: "some-id",
          imageVersions: null,
        },
      ],
      title: "some title",
    }
    const tree = renderWithWrappers(<MyCollectionArtworkHeader artwork={processingArtwork} relay={fakeRelay as any} />)
    expect(tree.root.findAllByType(OpaqueImageView)).toHaveLength(0)
    expect(tree.root.findByType(ArtworkIcon)).toBeDefined()
    expect(extractText(tree.root)).toContain("Processing photo")

    jest.advanceTimersByTime(1000)

    expect(fakeRelay.refetch).toHaveBeenCalled()
  })
})
