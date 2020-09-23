import { SaleLotsListTestsQuery } from "__generated__/SaleLotsListTestsQuery.graphql"
import LotsByFollowedArtists from "lib/Scenes/Sales/Components/LotsByFollowedArtists"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SaleLotsListContainer as SaleLotsList } from "../Components/SaleLotsList"

jest.unmock("react-relay")

describe("SaleLotsList", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<SaleLotsListTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SaleLotsListTestsQuery @relay_test_operation {
          me {
            ...SaleLotsList_me
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.me) {
          return <SaleLotsList me={props.me} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("Renders list of sale artworks without throwing an error", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Me: () => ({
          lotsByFollowedArtistsConnection: {
            edges: [
              {
                node: {
                  name: "TestName",
                  sale: {
                    is_open: true,
                  },
                  artwork: {
                    id: "foo",
                  },
                },
              },
            ],
          },
        }),
      })
    )

    expect(tree.root.findAllByType(LotsByFollowedArtists)).toHaveLength(1)
  })
})
