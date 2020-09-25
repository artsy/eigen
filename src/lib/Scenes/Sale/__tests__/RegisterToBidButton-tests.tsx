import { RegisterToBidButtonTestsQuery } from "__generated__/RegisterToBidButtonTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import { Text } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { RegisterToBidButton } from "../Components/RegisterToBidButton"

jest.unmock("react-relay")

describe("RegisterToBidButton", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<RegisterToBidButtonTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query RegisterToBidButtonTestsQuery @relay_test_operation {
          sale(id: "the-sale") {
            ...RegisterToBidButton_sale
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.sale) {
          return <RegisterToBidButton sale={props.sale} contextType="test" />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("shows button when not registered", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "the-sale",
          name: "the sale",
          internalID: "the-sale-internal",
          startAt: null,
          endAt: null,
          requireIdentityVerification: false,
          registrationStatus: null,
        }),
      })
    )

    expect(tree.root.findAllByType(Button)[0].props.children).toMatch("Register to bid")
  })

  it("shows green checkmark when registered", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "the-sale",
          name: "the sale",
          internalID: "the-sale-internal",
          startAt: null,
          endAt: null,
          requireIdentityVerification: false,
          registrationStatus: {
            qualifiedForBidding: true,
          },
        }),
      })
    )

    expect(tree.root.findAllByType(Text)[0].props.children).toMatch("You're approved to bid")
  })
})
