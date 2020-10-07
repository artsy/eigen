import { SaleTestsQuery } from "__generated__/SaleTestsQuery.graphql"
import { navigate } from "lib/navigation/navigate"
import { __appStoreTestUtils__ } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SaleContainer } from "../Sale"

jest.unmock("react-relay")

describe("Sale", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<SaleTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SaleTestsQuery @relay_test_operation {
          sale(id: "the-sale") {
            ...Sale_sale
          }
          me {
            ...Sale_me
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.sale && props?.me) {
          return <SaleContainer sale={props.sale} me={props.me} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("switches to live auction view when sale goes live", (done) => {
    renderWithWrappers(<TestRenderer />)

    const now = new Date()

    const inHalfSecond = new Date()
    inHalfSecond.setMilliseconds(now.getMilliseconds() + 500)

    const yesterday = new Date()
    yesterday.setHours(yesterday.getHours() - 24)

    const tomorrow = new Date()
    tomorrow.setHours(tomorrow.getHours() + 24)

    __appStoreTestUtils__?.injectState({
      native: { sessionState: { predictionURL: "https://live-staging.artsy.net" } },
    })

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "live-sale-slug",
          endAt: tomorrow.toISOString(),
          startAt: yesterday.toISOString(),
          timeZone: "Europe/Berlin",
          coverImage: {
            url: "cover image url",
          },
          name: "sale name",
          liveStartAt: inHalfSecond.toISOString(),
          internalID: "the-sale-internal",
        }),
      })
    )

    setTimeout(() => {
      expect(navigate).toHaveBeenCalledWith("https://live-staging.artsy.net/live-sale-slug")
      done()
    }, 1000)
  })
})
