import { ArtistInsightsTestsQuery } from "__generated__/ArtistInsightsTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { FlatList, View } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ArtistInsightsFragmentContainer } from "../ArtistInsights"

jest.unmock("react-relay")

describe("ArtistInsights", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<ArtistInsightsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ArtistInsightsTestsQuery @relay_test_operation {
          artist(id: "some-id") {
            ...ArtistInsights_artist
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.artist) {
          return <ArtistInsightsFragmentContainer artist={props.artist} />
        } else if (error !== null) {
          return <View /> // error
        }
        return <View /> // loading
      }}
    />
  )

  it("renders", () => {
    const counters: { [path: string]: number } = {}
    const pathToString = (pathComponents: readonly string[] | undefined) => pathComponents?.join(".") ?? "_GLOBAL_"
    const generateID = (pathComponents: readonly string[] | undefined) => {
      const path = pathToString(pathComponents)
      const currentCounter = counters[path]
      counters[path] = currentCounter === undefined ? 1 : currentCounter + 1
      return counters[path]
    }
    const mockArray = (length: number) => new Array(length).fill({ node: {} })

    const tree = renderWithWrappers(<TestRenderer />).root
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        String: (ctx) => `${ctx.name}-${generateID(ctx.path)}`,
        // make array 2 items
        Artist: () => ({
          auctionResultsConnection: {
            edges: mockArray(3),
          },
        }),
      })
    )
    // Artist: (ctx, generateId) => ({
    // name: "3",
    // auctionResultsConnection: {
    // edges: [
    // {
    // node: {
    // id: `${generateId()}`,
    // title: `title-${generateId()}`,
    // dateText: "date",
    // mediumText: "3",
    // saleDate: "2020",
    // organization: "39",
    // currency: "USD",
    // priceRealized: { display: "3", cents: 4 },
    // estimate: { low: 29 },
    // },
    // },
    // ],
    // },
    // }),
    // })
    // )

    expect(tree.findAllByType(FlatList)[1].findAllByType(Text)[2].props.children).toMatch("title-1")
  })
})
