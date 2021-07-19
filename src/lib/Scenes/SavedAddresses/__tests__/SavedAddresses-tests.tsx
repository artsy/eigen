import { SavedAddressesTestsQuery } from "__generated__/SavedAddressesTestsQuery.graphql"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button, Flex } from "palette"
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

  it("should render the saved addresses on the screen", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        Me: () => ({
          name: "saver",
          addressConnection: {
            edges: [
              {
                node: {
                  id: "VXNlckFkZHJlc3M6NTg0MA==",
                  internalID: "5840",
                  name: "George Tester",
                  addressLine1: "Stallschreiberstr 21",
                  addressLine2: "apt 61, 1st Floor",
                  addressLine3: null,
                  city: "Berlin",
                  region: "Mitte",
                  postalCode: "10179",
                  phoneNumber: "015904832846",
                },
              },
              {
                node: {
                  id: "VXNlckFkZHJlc3M6NTg2MQ==",
                  internalID: "5861",
                  name: "George Testing",
                  addressLine1: "401 Brodway",
                  addressLine2: "26th Floor",
                  addressLine3: null,
                  city: "New York",
                  region: "New York",
                  postalCode: "NY 10013",
                  phoneNumber: "1293581028945",
                },
              },
            ],
          },
        }),
      })
      return result
    })
    const text = extractText(tree.root)

    expect(text).toContain("George Tester")
    expect(text).toContain("Stallschreiberstr 21, apt 61, 1st Floor")
    expect(text).toContain("Berlin, 10179")
    expect(text).toContain("015904832846")

    expect(text).toContain("George Testing")
    expect(text).toContain("401 Brodway, 26th Floor")
    expect(text).toContain("New York, NY 10013")
    expect(text).toContain("1293581028945")

    expect(text).toContain("Edit")
    expect(text).toContain("Delete")
  })
  it("testing add new address navigation", () => {
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
    tree.findByType(Button).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/my-profile/saved-addresses/new-address")
  })
})
