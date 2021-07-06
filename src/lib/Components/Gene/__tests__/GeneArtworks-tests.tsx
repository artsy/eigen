import { GeneArtworksTestsQuery } from "__generated__/GeneArtworksTestsQuery.graphql"
import { ApplyButton } from 'lib/Components/ArtworkFilter'
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { ArtworksFilterHeader } from "lib/Components/ArtworkGrids/FilterHeader"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { TouchableRow } from 'lib/Components/TouchableRow'
import { extractText } from 'lib/tests/extractText'
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Message, TouchableHighlightColor } from 'palette'
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from 'react-test-renderer'
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { GeneArtworksPaginationContainer } from "../GeneArtworks"

jest.unmock("react-relay")

describe("GeneArtworks", () => {
  const trackEvent = jest.fn()
  const geneID = "gene-id"
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
      <QueryRenderer<GeneArtworksTestsQuery>
        environment={environment}
        query={graphql`
          query GeneArtworksTestsQuery($geneID: String!, $input: FilterArtworksInput) @relay_test_operation {
            gene(id: $geneID) {
              ...GeneArtworks_gene @arguments(input: $input)
            }
          }
        `}
        render={({ props }) => {
          if (props?.gene) {
            return (
              <StickyTabPage
                staticHeaderContent={<></>}
                tabs={[
                  {
                    title: "GeneArtworks",
                    content: <GeneArtworksPaginationContainer gene={props.gene} />,
                  },
                ]}
              />
            )
          }

          return null
        }}
        variables={{
          geneID,
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
      Gene() {
        return {
          artworks: {
            counts: {
              total: 0,
            }
          },
        }
      },
    })

    expect(tree.root.findAllByType(Message)).toHaveLength(1)
    expect(extractText(tree.root.findByType(Message))).toEqual(
      "There aren’t any works available in the category at this time."
    )
  })
})
