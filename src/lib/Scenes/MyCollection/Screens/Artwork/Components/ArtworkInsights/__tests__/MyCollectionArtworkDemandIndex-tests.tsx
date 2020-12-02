import { MyCollectionArtworkDemandIndexTestsQuery } from "__generated__/MyCollectionArtworkDemandIndexTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { InfoButton } from "../InfoButton"
import { MyCollectionArtworkDemandIndexFragmentContainer, tests } from "../MyCollectionArtworkDemandIndex"

jest.unmock("react-relay")

describe("MyCollectionArtworkDemandIndex", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkDemandIndexTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkDemandIndexTestsQuery @relay_test_operation {
          marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
            ...MyCollectionArtworkDemandIndex_marketPriceInsights
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.marketPriceInsights) {
          return <MyCollectionArtworkDemandIndexFragmentContainer marketPriceInsights={props.marketPriceInsights} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const resolveData = (passedProps = {}) => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, passedProps)
    )
  }

  it("renders without throwing an error", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData({
      MarketPriceInsights: () => ({
        demandRank: 8,
      }),
    })
    expect(wrapper.root.findByType(InfoButton)).toBeDefined()
    expect(wrapper.root.findByType(tests.DemandRankScale)).toBeDefined()
    expect(wrapper.root.findByType(tests.DemandRankDetails)).toBeDefined()
    const text = extractText(wrapper.root)
    expect(text).toContain("Demand index")
    expect(text).toContain("80.0010")
    expect(text).toContain("Very Strong Demand (> 9.0)")
  })
})
