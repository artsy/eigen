import { SavedAddressesTestsQuery } from "__generated__/SavedAddressesTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Flex } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SavedAddressesContainer, SavedAddressesQueryRenderer } from "../SavedAddresses"

jest.unmock("react-relay")

describe(SavedAddressesQueryRenderer, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<SavedAddressesTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SavedAddressesTestsQuery {
          me {
            ...SavedAddresses_me
          }
        }
      `}
      render={({ props, error }) => {
        if (props?.me) {
          return <SavedAddressesContainer me={props.me} />
        } else if (error) {
          console.log(error)
        }
      }}
      variables={{}}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders no saved addresses screen", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        Me: () => ({
          name: "saver",
          addressConnection: {
            edges: [],
          },
        }),
      })
      return result
    })

    expect(tree.findAllByType(Flex)[4].props.children[0].props.children).toEqual("No Saved Addresses")
  })
})
