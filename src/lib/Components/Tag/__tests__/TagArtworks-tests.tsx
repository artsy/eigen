import { TagArtworksTestsQuery } from "__generated__/TagArtworksTestsQuery.graphql"
import { ApplyButton } from "lib/Components/ArtworkFilter"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { ArtworksFilterHeader } from "lib/Components/ArtworkGrids/FilterHeader"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { TouchableRow } from "lib/Components/TouchableRow"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Message, TouchableHighlightColor } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { TagArtworksPaginationContainer } from "../TagArtworks"

jest.unmock("react-relay")

describe("TagArtworks", () => {
  const trackEvent = jest.fn()
  const tagID = "tag-id"
  let environment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    environment = createMockEnvironment()
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  afterEach(() => {
    trackEvent.mockClear()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<TagArtworksTestsQuery>
        environment={environment}
        query={graphql`
          query TagArtworksTestsQuery($tagID: String!, $input: FilterArtworksInput) @relay_test_operation {
            tag(id: $tagID) {
              ...TagArtworks_tag @arguments(input: $input)
            }
          }
        `}
        render={({ props }) => {
          if (props?.tag) {
            return <TagArtworksPaginationContainer tag={props.tag} />
          }
          return null
        }}
        variables={{
          tagID,
          input: {
            medium: "*",
            priceRange: "*-*",
          },
        }}
      />
    )
  }

  it("renders without throwing an error", () => {
    renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(environment)
  })

  it("renders filter header", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(environment)

    expect(tree.root.findAllByType(ArtworksFilterHeader)).toHaveLength(1)
  })

  it("renders artworks grid", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(environment, {
      FilterArtworksConnection() {
        return {
          counts: {
            total: 10,
          },
        }
      },
    })

    expect(tree.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(1)
  })

  it("renders empty artworks grid view", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(environment, {
      FilterArtworksConnection() {
        return {
          counts: {
            total: 10,
          },
        }
      },
    })

    // Change sort filter
    act(() => tree.root.findByType(TouchableHighlightColor).props.onPress())
    act(() => tree.root.findAllByType(TouchableRow)[0].props.onPress())
    act(() => tree.root.findAllByType(TouchableRow)[1].props.onPress())
    act(() => tree.root.findAllByType(TouchableRow)[1].props.onPress())
    act(() => tree.root.findByType(ApplyButton).props.onPress())

    mockEnvironmentPayload(environment, {
      FilterArtworksConnection() {
        return {
          counts: {
            total: 0,
          },
        }
      },
    })

    expect(tree.root.findAllByType(FilteredArtworkGridZeroState)).toHaveLength(1)
  })

  it("renders empty message when artworks is empty", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(environment, {
      Tag() {
        return {
          artworks: {
            counts: {
              total: 0,
            },
          },
        }
      },
    })

    expect(tree.root.findAllByType(Message)).toHaveLength(1)
    expect(extractText(tree.root.findByType(Message))).toEqual(
      "There aren’t any works available in the tag at this time."
    )
  })
})
