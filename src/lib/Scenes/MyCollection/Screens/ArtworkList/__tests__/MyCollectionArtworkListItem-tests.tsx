import { MyCollectionArtworkListItemTestsQuery } from "__generated__/MyCollectionArtworkListItemTestsQuery.graphql"
import { navigate } from "lib/navigation/navigate"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Image as RNImage } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkListItemFragmentContainer, tests } from "../MyCollectionArtworkListItem"

jest.unmock("react-relay")

describe("MyCollectionArtworkListItem", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkListItemTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkListItemTestsQuery @relay_test_operation {
          artwork(id: "some-slug") {
            ...MyCollectionArtwork_sharedProps @relay(mask: false)
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <MyCollectionArtworkListItemFragmentContainer artwork={props.artwork as any} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const resolveData = () => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation))
  }

  it("renders correct fields", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    expect(wrapper.root.findByType(tests.TouchElement)).toBeDefined()
    expect(wrapper.root.findByProps({ "data-test-id": "Image" })).toBeDefined()
    const text = extractText(wrapper.root)
    expect(text).toContain("artistNames")
    expect(text).toContain("title")
    expect(text).toContain("medium")
  })

  it("navigates to artwork detail on click", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    wrapper.root.findByType(tests.TouchElement).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/my-collection/artwork/<Artwork-mock-id-5>", {
      passProps: {
        artistInternalID: "<Artist-mock-id-1>",
        medium: '<mock-value-for-field-"medium">',
      },
    })
  })

  it("uses last uploaded image as a fallback when no url is present", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    __globalStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            lastUploadedPhoto: {
              path: "some-local-path",
              size: 1800,
              data: "some-data",
              width: 90,
              height: 90,
              mime: "some-mime",
              exif: {} as any,
              cropRect: {} as any,
              filename: "some-file-name",
              creationDate: "some-creation-date",
            },
          },
        },
      },
    })
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Artwork: () => ({
          image: {
            url: null,
          },
        }),
      })
    )
    const image = wrapper.root.findByType(RNImage)
    expect(image.props.source).toEqual({ uri: "some-local-path" })
  })
})
