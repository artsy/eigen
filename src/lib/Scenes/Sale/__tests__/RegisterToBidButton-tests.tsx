import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import { Text } from "palette"
import React from "react"
import { RelayEnvironmentProvider } from "relay-hooks"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { RegisterToBidButton } from "../Components/RegisterToBidButton"
import { Sale, SaleQueryRenderer } from "../Sale"

jest.unmock("react-relay")

describe(RegisterToBidButton, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <SaleQueryRenderer saleID="the-sale" />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("shows button when not registered", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
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
      return result
    })

    expect(tree.root.findAllByType(Button)[0].props.children).toMatch("Register to bid")
  })

  it("shows green checkmark when registered", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
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
      return result
    })

    expect(tree.root.findAllByType(Text)[1].props.children).toMatch("You're approved to bid")
  })
})
