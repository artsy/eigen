import { MyCollectionArtworkListItemTestsQuery } from "__generated__/MyCollectionArtworkListItemTestsQuery.graphql"
import { AppStore } from "lib/store/AppStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
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
            ...MyCollectionArtworkDetail_sharedProps @relay(mask: false)
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
    const spy = jest.fn()
    AppStore.actions.myCollection.navigation.navigateToArtworkDetail = spy as any
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    wrapper.root.findByType(tests.TouchElement).props.onPress()
    expect(spy).toHaveBeenCalledWith({
      artistInternalID: "<Artist-mock-id-1>",
      artworkSlug: "<Artwork-mock-id-5>",
      medium: '<mock-value-for-field-"medium">',
    })
  })
})
