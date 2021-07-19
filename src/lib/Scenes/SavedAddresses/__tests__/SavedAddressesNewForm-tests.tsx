import { SavedAddressesNewFormTestsQuery } from "__generated__/SavedAddressesNewFormTestsQuery.graphql"
import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { Input } from "lib/Components/Input/Input"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SavedAddressesNewFormContainer, SavedAddressesNewFormQueryRenderer } from "../SavedAddressesNewForm"

jest.unmock("react-relay")

describe(SavedAddressesNewFormQueryRenderer, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<SavedAddressesNewFormTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SavedAddressesNewFormTestsQuery {
          me {
            ...SavedAddressesNewForm_me
          }
        }
      `}
      render={({ props, error }) => {
        if (props?.me) {
          return <SavedAddressesNewFormContainer me={props.me} />
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

  it("render form screen", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        Me: () => ({
          id: "some-id",
          phone: "9379992",
          addressConnection: {
            edges: [],
          },
        }),
      })
      return result
    })

    expect(tree.findAllByType(Input).length).toEqual(7)
    expect(tree.findAllByType(PhoneInput).length).toEqual(1)
    expect(tree.findAllByType(Checkbox).length).toEqual(1)
    expect(tree.findAllByType(Button).length).toEqual(1)
  })
})
