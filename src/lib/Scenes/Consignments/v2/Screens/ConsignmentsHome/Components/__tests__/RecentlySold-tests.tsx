import { Theme } from "@artsy/palette"
import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { create } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

import { RecentlySoldTestsQuery } from "__generated__/RecentlySoldTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { RecentlySoldFragmentContainer } from "../RecentlySold"

jest.unmock("react-relay")
jest.mock("react-tracking")

describe("RecentlySold", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => (
    <Theme>
      <QueryRenderer<RecentlySoldTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query RecentlySoldTestsQuery {
            targetSupply {
              ...RecentlySold_targetSupply
            }
          }
        `}
        render={renderWithLoadProgress(RecentlySoldFragmentContainer)}
        variables={{}}
      />
    </Theme>
  )

  it("renders sale message if artwork has realized price", () => {
    const tree = create(<TestRenderer />)

    const artwork = {
      realizedPrice: "$1,200",
    }
    const targetSupply = makeTargetSupply([artwork])

    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        TargetSupply: () => targetSupply,
      })
      return result
    })

    expect(extractText(tree.root)).toContain("Sold for $1,200")
  })

  it("does not render any sale message if artwork has no realized price", () => {
    const tree = create(<TestRenderer />)

    const artwork = {
      realizedPrice: null,
    }
    const targetSupply = makeTargetSupply([artwork])

    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        TargetSupply: () => targetSupply,
      })
      return result
    })

    expect(extractText(tree.root)).not.toContain("Sold for")
  })

  it("renders an artwork for each artist", () => {
    const tree = create(<TestRenderer />)

    const targetSupply = makeTargetSupply([
      {
        artistNames: "artist #1",
      },
      {
        artistNames: "artist #2",
      },
      {
        artistNames: "artist #3",
      },
      {
        artistNames: "artist #4",
      },
      {
        artistNames: "artist #5",
      },
    ])

    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        TargetSupply: () => targetSupply,
      })
      return result
    })

    const text = extractText(tree.root)
    expect(text).toContain("artist #1")
    expect(text).toContain("artist #2")
    expect(text).toContain("artist #3")
    expect(text).toContain("artist #4")
    expect(text).toContain("artist #5")
  })
})

function makeTargetSupply(artworks: Array<{ artistNames?: string; realizedPrice?: string | null }>) {
  const items = artworks.map(artwork => {
    return {
      artworksConnection: {
        edges: [
          {
            node: artwork,
          },
        ],
      },
    }
  })

  return {
    microfunnel: items,
  }
}
