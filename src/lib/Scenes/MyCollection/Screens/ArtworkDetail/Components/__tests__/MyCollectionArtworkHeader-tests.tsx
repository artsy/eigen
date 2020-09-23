import { MyCollectionArtworkHeaderTestsQuery } from "__generated__/MyCollectionArtworkHeaderTestsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkHeaderFragmentContainer } from "../MyCollectionArtworkHeader"

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

  it("renders without throwing an error", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Artwork: () => ({
          artistNames: "some artist name",
          date: "Jan 20th",
          image: {
            url: "some/url",
          },
          title: "some title",
        }),
      })
    )

    const text = extractText(wrapper.root)
    expect(text).toContain("some artist name")
    expect(text).toContain("some title, Jan 20th")
    expect(wrapper.root.findAllByType(OpaqueImageView)).toBeDefined()
  })
})
