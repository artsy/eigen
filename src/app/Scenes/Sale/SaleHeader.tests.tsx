import { SaleHeaderTestsQuery } from "__generated__/SaleHeaderTestsQuery.graphql"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import moment from "moment"
import React from "react"
import { Animated } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SaleHeaderContainer } from "./Components/SaleHeader"

jest.unmock("react-relay")

describe("SaleHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<SaleHeaderTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SaleHeaderTestsQuery @relay_test_operation {
          sale(id: "the-sale") {
            ...SaleHeader_sale
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.sale) {
          return <SaleHeaderContainer sale={props.sale} scrollAnim={new Animated.Value(0)} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders without throwing an error", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          endAt: "2020-11-01T15:00:00",
          startAt: "2020-10-01T15:00:00",
          timeZone: "Europe/Berlin",
          coverImage: {
            url: "cover image url",
          },
          name: "sale name",
          liveStartAt: "2020-10-01T15:00:00",
          internalID: "the-sale-internal",
        }),
      })
    )

    expect(extractText(tree.root.findByProps({ testID: "saleName" }))).toBe("sale name")
    expect(tree.root.findAllByType(CaretButton)).toHaveLength(1)
  })

  it("renders auction is closed when an auction has passed", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          endAt: moment().subtract(1, "day").toISOString(),
          startAt: "2020-09-01T15:00:00",
          timeZone: "Europe/Berlin",
          coverImage: {
            url: "cover image url",
          },
          name: "sale name",
          liveStartAt: "2020-09-01T15:00:00",
          internalID: "the-sale-internal",
        }),
      })
    )

    expect(extractText(tree.root.findByProps({ testID: "sale-header-hero" }))).toBe(
      "Auction closed"
    )
  })

  it("does not render auction is closed when an auction is still active", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          endAt: moment().add(1, "day").toISOString(),
          startAt: "2020-09-01T15:00:00",
          timeZone: "Europe/Berlin",
          coverImage: {
            url: "cover image url",
          },
          name: "sale name",
          liveStartAt: "2020-09-01T15:00:00",
          internalID: "the-sale-internal",
        }),
      })
    )

    expect(extractText(tree.root.findAllByType(OpaqueImageView)[0])).not.toContain("Auction closed")
  })
})
