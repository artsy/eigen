import { SoldBySectionTestsQuery } from "__generated__/SoldBySectionTestsQuery.graphql"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { SoldBySectionFragmentContainer } from "../Components/SoldBySection"

jest.unmock("react-relay")

describe("SoldBySection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<SoldBySectionTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SoldBySectionTestsQuery @relay_test_operation {
          commerceOrder(id: "some-id") {
            ...SoldBySection_soldBy
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.commerceOrder) {
          return <SoldBySectionFragmentContainer soldBy={props.commerceOrder} />
        }
        return null
      }}
    />
  )
  it("renders auction result when auction results are available", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    mockEnvironmentPayload(mockEnvironment, {
      CommerceOrder: () => ({
        lineItems: {
          edges: [
            {
              node: {
                fulfillments: {
                  edges: [
                    {
                      node: {
                        createdAt: "asd",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      }),
    })

    expect(tree.findByProps({ testID: "date" }).props.children).toBe("2017")
    expect(tree.findByProps({ testID: "medium" }).props.children).toBe("Rayon thread on poly twill backed")

    expect(tree.findByProps({ testID: "title" }).props.children).toBe(
      "Set of Six (Six) Scout Series Embroidered Patches, "
    )
    expect(tree.findByProps({ testID: "image" }).props.source).toStrictEqual({
      uri: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
    })
    expect(tree.findByProps({ testID: "artistNames" }).props.children).toBe("Kerry James Marshall")
    expect(tree.findByProps({ testID: "editionOf" }).props.children).toBe("edit of 30")
  })
})
