import { TagTestsQuery } from "__generated__/TagTestsQuery.graphql"
import { ArtworkFilterOptionsScreen } from "app/Components/ArtworkFilter"
import About from "app/Components/Tag/About"
import { TagArtworks } from "app/Components/Tag/TagArtworks"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { TouchableHighlightColor } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { Tag } from "./Tag"

jest.unmock("react-relay")

describe("Tag", () => {
  const tagID = "skull"
  let environment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    environment = createMockEnvironment()
  })

  function mockMostRecentOperation(mockResolvers: MockResolvers = {}) {
    environment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        ...mockResolvers,
      })
      return result
    })
  }

  const TestRenderer = () => {
    return (
      <QueryRenderer<TagTestsQuery>
        environment={environment}
        query={graphql`
          query TagTestsQuery($tagID: String!, $input: FilterArtworksInput) @relay_test_operation {
            tag(id: $tagID) {
              slug
              description
              ...TagHeader_tag
              ...About_tag
              ...TagArtworks_tag @arguments(input: $input)
            }
          }
        `}
        render={({ props }) => {
          if (props?.tag) {
            return <Tag tagID={tagID} tag={props.tag} />
          }

          return null
        }}
        variables={{ tagID }}
      />
    )
  }

  it("renders without throwing an error", () => {
    renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(environment)
  })

  it("returns all tabs", async () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(environment)

    expect(tree.root.findAllByType(TagArtworks)).toHaveLength(1)
    expect(tree.root.findAllByType(About)).toHaveLength(1)
  })

  it('don\'t render "about" tab without description', async () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockMostRecentOperation({
      Tag() {
        return {
          description: null,
        }
      },
    })

    expect(tree.root.findAllByType(TagArtworks)).toHaveLength(1)
    expect(tree.root.findAllByType(About)).toHaveLength(0)
  })

  it("renders filter modal", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(environment)

    act(() => tree.root.findByType(TouchableHighlightColor).props.onPress())

    expect(tree.root.findAllByType(ArtworkFilterOptionsScreen)).toHaveLength(1)
  })
})
