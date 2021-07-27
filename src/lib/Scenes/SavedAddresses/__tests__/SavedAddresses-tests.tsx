import { SavedAddressesTestsQuery } from "__generated__/SavedAddressesTestsQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Flex, Touchable } from "palette"
import React from "react"
import { Platform } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SavedAddressesContainer, SavedAddressesQueryRenderer } from "../SavedAddresses"

jest.unmock("react-relay")

interface Mutation {
  name: string
  variables: Record<string, any>
}

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
        console.log("mesa renderer mockEnvironment", mockEnvironment)
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
    Platform.OS = "android"
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

  const mockedAddressesResponse = {
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
  }

  it("should render the saved addresses on the screen", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, mockedAddressesResponse)
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

  // the test that is breaking
  it("should successfully delete address on delete button press", async () => {
    console.log({ mockEnvironment })
    // set the mutation
    const mutation: Mutation = {
      name: "deleteSavedAddressDeleteUserAddressMutation",
      variables: {
        input: {
          userAddressID: "5861",
        },
      },
    }
    // Do we actually need this? (took the idea from savedSearchBanner-tests)
    // const mockResolvers = {
    //   Me: () => ({
    //     addressConnection: {
    //       edges: [
    //         {
    //           node: {
    //             id: "VXNlckFkZHJlc3M6NTg0MA==",
    //             internalID: "5840",
    //             name: "George Tester",
    //             addressLine1: "Stallschreiberstr 21",
    //             addressLine2: "apt 61, 1st Floor",
    //             addressLine3: null,
    //             city: "Berlin",
    //             region: "Mitte",
    //             postalCode: "10179",
    //             phoneNumber: "015904832846",
    //           },
    //         },
    //         {
    //           node: {
    //             id: "VXNlckFkZHJlc3M6NTg2MQ==",
    //             internalID: "5861",
    //             name: "George Testing",
    //             addressLine1: "401 Brodway",
    //             addressLine2: "26th Floor",
    //             addressLine3: null,
    //             city: "New York",
    //             region: "New York",
    //             postalCode: "NY 10013",
    //             phoneNumber: "1293581028945",
    //           },
    //         },
    //       ],
    //     },
    //   }),
    // }

    // do the initial setup
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, mockedAddressesResponse)
      return result
    })

    // track the button
    const deleteButton = tree.root
      .findAllByType(Touchable)
      .filter((touchable) => touchable.props.testID === "Delete-5861")[0]

    await act(async () => deleteButton.props.onPress())
    // // this breaks
    console.log("About to call most recent op")
    const createOperation = mockEnvironment.mock.getMostRecentOperation()

    // expect(createOperation.request.node.operation.name).toEqual(mutation.name)
    // expect(createOperation.request.variables).toEqual(mutation.variables)

    // act(() => mockEnvironment.mock.resolve(createOperation, MockPayloadGenerator.generate(createOperation)))
    // // lsls

    // const refetchOperation = mockEnvironment.mock.getMostRecentOperation()
    // expect(refetchOperation.request.node.operation.name).toEqual("SavedSearchBannerRefetchQuery")
    // act(() => mockEnvironment.mock.resolveMostRecentOperation(MockPayloadGenerator.generate(refetchOperation)))

    // assert that the address card is unmounted
  })
})
