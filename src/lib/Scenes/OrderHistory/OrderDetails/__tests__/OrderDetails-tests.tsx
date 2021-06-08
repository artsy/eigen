import { OrderDetailsTestsQuery } from "__generated__/OrderDetailsTestsQuery.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { SectionList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ArtworkInfoSectionFragmentContainer } from "../Components/ArtworkInfoSection"
import { OrderDetailsContainer, OrderDetailsPlaceholder, OrderDetailsQueryRender } from "../Components/OrderDetails"
import { OrderDetailsHeader } from "../Components/OrderDetailsHeader"
import { CreditCardSummaryItemFragmentContainer } from "../Components/OrderDetailsPayment"
import { ShipsToSectionFragmentContainer } from "../Components/ShipsToSection"
import { SummarySectionFragmentContainer } from "../Components/SummarySection"

jest.unmock("react-relay")

describe(OrderDetailsQueryRender, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<OrderDetailsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query OrderDetailsTestsQuery {
          order: commerceOrder(id: "order-id") {
            ...OrderDetails_order
          }
          me {
            name
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.order) {
          return <OrderDetailsContainer me={props.me} order={props.order} />
        }
      }}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })
  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        name: "my name",
      }),
      CommerceOrder: () => ({
        internalID: "222",
        requestedFulfillment: {
          addressLine1: "myadress",
          city: "mycity",
          country: "mycountry",
          postalCode: "11238",
          phoneNumber: "7777",
          region: "myregion",
        },
        lineItems: {
          edges: [
            {
              node: {
                artwork: {
                  medium: "Rayon thread on poly twill backed",
                  editionOf: "edit of 30",
                  dimensions: {
                    cm: "10.5 × 7.9 cm",
                    in: "4 1/8 × 3 1/8 in",
                  },
                  artistNames: "Kerry James Marshall",
                  date: "2017",
                  image: {
                    url: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
                  },
                  title: "Set of Six (Six) Scout Series Embroidered Patches",
                },
              },
            },
          ],
        },
      }),
    })

    expect(tree.root.findByType(SectionList)).toBeTruthy()
    expect(tree.root.findByType(ArtworkInfoSectionFragmentContainer)).toBeTruthy()
    expect(tree.root.findByType(SummarySectionFragmentContainer)).toBeTruthy()
    expect(tree.root.findByType(CreditCardSummaryItemFragmentContainer)).toBeTruthy()
    expect(tree.root.findByType(ShipsToSectionFragmentContainer)).toBeTruthy()
    expect(tree.root.findByType(OrderDetailsHeader)).toBeTruthy()
  })

  it("renders without throwing an error", () => {
    getWrapper()
  })

  it("renders props for OrderDetails if feature flag is on", () => {
    const tree = getWrapper({
      Me: () => ({
        name: "my name",
      }),
    })
    expect(extractText(tree.root)).toContain("my name")
  })

  it("doesn't render MyCollections app if feature flag is not on", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).not.toContain("my name")
  })

  it("Loads OrderHistoryQueryRender with OrderDetailsPlaceholder", () => {
    const tree = renderWithWrappers(<OrderDetailsQueryRender orderID="21856921-fa90-4a36-a17e-dd52870952d2" />)
    expect(tree.root.findAllByType(OrderDetailsPlaceholder)).toHaveLength(1)
  })
  it("Loads OrderHistoryQueryRender with PageWithSimpleHeader", () => {
    const tree = renderWithWrappers(<OrderDetailsQueryRender orderID="21856921-fa90-4a36-a17e-dd52870952d2" />)
    expect(tree.root.findAllByType(PageWithSimpleHeader)).toHaveLength(1)
  })
})
