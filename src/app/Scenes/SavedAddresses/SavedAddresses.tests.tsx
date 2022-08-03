import { fireEvent } from "@testing-library/react-native"
import { SavedAddressesTestsQuery } from "__generated__/SavedAddressesTestsQuery.graphql"
import { navigate, navigationEvents } from "app/navigation/navigate"
import { getMockRelayEnvironment, getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"

import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { SavedAddressesContainer, SavedAddressesQueryRenderer, util } from "./SavedAddresses"

describe(SavedAddressesQueryRenderer, () => {
  const TestRenderer = () => (
    <QueryRenderer<SavedAddressesTestsQuery>
      environment={getRelayEnvironment()}
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

  it("renders no saved addresses screen", () => {
    const { queryByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Me: () => ({
        name: "saver",
        addressConnection: {
          edges: [],
        },
      }),
    })

    expect(queryByText("No Saved Addresses")).toBeTruthy()
  })

  it("should render the saved addresses on the screen", () => {
    const { queryByText, queryAllByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
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
                addressLine2: "24th Floor",
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

    expect(queryByText("George Tester")).toBeTruthy()
    expect(queryByText("Stallschreiberstr 21, apt 61, 1st Floor")).toBeTruthy()
    expect(queryByText("Berlin, 10179")).toBeTruthy()
    expect(queryByText("015904832846")).toBeTruthy()

    expect(queryByText("George Testing")).toBeTruthy()
    expect(queryByText("401 Brodway, 24th Floor")).toBeTruthy()
    expect(queryByText("New York, NY 10013")).toBeTruthy()
    expect(queryByText("1293581028945")).toBeTruthy()

    expect(queryAllByText("Edit")).toHaveLength(2)
    expect(queryAllByText("Delete")).toHaveLength(2)
  })

  it("testing add new address navigation", () => {
    const { getAllByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Me: () => ({
        name: "saver",
        addressConnection: {
          edges: [],
        },
      }),
    })

    fireEvent.press(getAllByText("Add New Address")[0])
    expect(navigate).toHaveBeenCalledWith("/my-profile/saved-addresses/new-address", {
      modal: true,
    })
  })

  it("should navigate to edit address screen", () => {
    const { getByTestId } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
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
                addressLine2: "24th Floor",
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

    const EditButton = getByTestId("EditAddress-5861")

    fireEvent.press(EditButton)
    expect(navigate).toHaveBeenCalledWith("/my-profile/saved-addresses/edit-address", {
      modal: true,
      passProps: { addressId: "5861" },
    })
  })

  it("handles return to prev view with goBack event", () => {
    const mockCallback = jest.fn(util.onRefresh)
    navigationEvents.addListener("goBack", mockCallback)
    navigationEvents.emit("goBack")
    expect(mockCallback.mock.calls.length).toBe(1)
  })

  it("deletes successfully an address from the address list", () => {
    const { getAllByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
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
                addressLine2: "24th Floor",
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

    fireEvent.press(getAllByText("Delete")[0])

    const createOperation = getMockRelayEnvironment().mock.getMostRecentOperation()
    expect(createOperation.request.variables).toEqual({ input: { userAddressID: "5840" } })
  })
})
