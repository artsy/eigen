import { tappedCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionArtworkGridItemTestsQuery } from "__generated__/MyCollectionArtworkGridItemTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { extractText } from "app/tests/extractText"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
import * as LocalImageStore from "app/utils/LocalImageStore"
import { LocalImage } from "app/utils/LocalImageStore"
import React from "react"
import { Image as RNImage } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkGridItemFragmentContainer, tests } from "./MyCollectionArtworkGridItem"

jest.unmock("react-relay")

describe("MyCollectionArtworkGridItem", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkGridItemTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkGridItemTestsQuery @relay_test_operation {
          artwork(id: "some-slug") {
            ...MyCollectionArtworkGridItem_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <MyCollectionArtworkGridItemFragmentContainer artwork={props.artwork as any} />
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

  const resolveData = () => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Artwork: () => ({
          internalID: "artwork-id",
          slug: "artwork-slug",
          artist: {
            internalID: "artist-id",
          },
          images: null,
          medium: "artwork medium",
        }),
      })
    )
  }

  it("renders correct fields", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    expect(wrapper.root.findByType(tests.TouchElement)).toBeDefined()
    expect(wrapper.root.findByProps({ testID: "Fallback" })).toBeDefined()
    const text = extractText(wrapper.root)
    expect(text).toContain("artistNames")
    expect(text).toContain("title")
  })

  it("navigates to artwork detail on tap", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    wrapper.root.findByType(tests.TouchElement).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/my-collection/artwork/artwork-slug", {
      passProps: {
        artistInternalID: "artist-id",
        medium: "artwork medium",
      },
    })
  })

  it("tracks analytics event on tap", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    wrapper.root.findByType(tests.TouchElement).props.onPress()

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith(
      tappedCollectedArtwork({
        destinationOwnerId: "artwork-id",
        destinationOwnerSlug: "artwork-slug",
      })
    )
  })

  it("uses last uploaded image as a fallback when no url is present", async () => {
    const localImageStoreMock = jest.spyOn(LocalImageStore, "retrieveLocalImages")
    const localImage: LocalImage = {
      path: "some-local-path",
      width: 10,
      height: 10,
    }
    const retrievalPromise = new Promise<LocalImage[]>((resolve) => {
      resolve([localImage])
    })
    localImageStoreMock.mockImplementation(() => retrievalPromise)

    act(async () => {
      const wrapper = renderWithWrappers(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Artwork: () => ({
            images: [
              {
                url: null,
              },
            ],
          }),
        })
      )
      await retrievalPromise
      const image = wrapper.root.findByType(RNImage)
      expect(image.props.source).toEqual({ uri: "some-local-path" })
    })
  })

  it("renders the high demand icon if artist is P1 and demand rank is over 9", () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    // mocking isP1 and demandRank
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Artwork: () => ({
          internalID: "artwork-id",
          slug: "artwork-slug",
          artist: {
            internalID: "artist-id",
            targetSupply: {
              isP1: true,
            },
          },
          medium: "artwork medium",
          marketPriceInsights: {
            demandRank: 0.91,
          },
        }),
      })
    )
    expect(getByTestId("test-high-demand-icon")).toBeTruthy()
  })
})
