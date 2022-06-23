import { fireEvent, waitFor } from "@testing-library/react-native"
import { TagTestsQuery } from "__generated__/TagTestsQuery.graphql"
import { ArtworkFilterOptionsScreen } from "app/Components/ArtworkFilter"
import About from "app/Components/Tag/About"
import { TagArtworks } from "app/Components/Tag/TagArtworks"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { TouchableHighlightColor } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
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
    resolveMostRecentRelayOperation(environment)
  })

  it("returns all tabs", async () => {
    const tree = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(environment)

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

  it("renders filter modal", async () => {
    const { UNSAFE_getByType, UNSAFE_getAllByType } = renderWithWrappersTL(<TestRenderer />)
    resolveMostRecentRelayOperation(environment)

    await waitFor(() => expect(UNSAFE_getByType(TouchableHighlightColor)).toBeTruthy())
    fireEvent.press(UNSAFE_getByType(TouchableHighlightColor))

    expect(UNSAFE_getAllByType(ArtworkFilterOptionsScreen)).toHaveLength(1)
  })
})
