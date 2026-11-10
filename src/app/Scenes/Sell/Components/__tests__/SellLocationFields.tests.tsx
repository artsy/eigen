import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SellLocationFieldsTestQuery } from "__generated__/SellLocationFieldsTestQuery.graphql"
import { SellLocationFields } from "app/Scenes/Sell/Components/SellLocationFields"
import { SellLocationStore, SellSavedAddress } from "app/Scenes/Sell/State/SellLocationStore"
import { getLocationDetails, getLocationPredictions } from "app/utils/googleMaps"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { useEffect } from "react"
import { graphql } from "react-relay"

jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
}))

const PLACE = { id: "place-1", name: "401 Broadway, New York, NY, USA" }

const address = (internalID: string, overrides: Partial<SellSavedAddress> = {}) => ({
  internalID,
  name: `Collector ${internalID}`,
  addressLine1: `${internalID} Main St`,
  addressLine2: null,
  city: "New York",
  region: "NY",
  postalCode: "10013",
  country: "US",
  isDefault: false,
  phoneNumber: null,
  ...overrides,
})

const addressConnection = (addresses: ReturnType<typeof address>[]) => ({
  edges: addresses.map((node) => ({ node })),
})

const onAddress = jest.fn()

// Reports each address the store picks, so tests can check the selection
const AddressSpy: React.FC = () => {
  const selected = SellLocationStore.useStoreState((state) => state.address)

  useEffect(() => {
    if (selected) {
      onAddress(selected)
    }
  }, [selected])

  return null
}

const TestLocationFields: React.FC<{ me: SellLocationFieldsTestQuery["response"]["me"] }> = ({
  me,
}) => (
  <SellLocationStore.Provider>
    <SellLocationFields me={me!} />
    <AddressSpy />
  </SellLocationStore.Provider>
)

const { renderWithRelay } = setupTestWrapper<SellLocationFieldsTestQuery>({
  Component: TestLocationFields,
  query: graphql`
    query SellLocationFieldsTestQuery @relay_test_operation {
      me {
        ...SellLocationFields_me
      }
    }
  `,
})

describe("SellLocationFields", () => {
  beforeEach(() => {
    ;(getLocationPredictions as jest.Mock).mockResolvedValue([PLACE])
    ;(getLocationDetails as jest.Mock).mockResolvedValue({
      ...PLACE,
      street: "401 Broadway",
      city: "New York",
      stateCode: "NY",
      countryCode: "US",
      postalCode: "10013",
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("lists the default US address first and selected, and greys out other countries", () => {
    renderWithRelay({
      Me: () => ({
        addressConnection: addressConnection([
          address("1"),
          address("2", { country: "FR" }),
          address("3", { isDefault: true }),
        ]),
      }),
    })

    const radios = screen.getAllByRole("radio")
    expect(radios).toHaveLength(3)
    expect(radios[0]).toHaveAccessibleName(/^Collector 3/)
    expect(radios[0]).toBeChecked()
    expect(radios[2]).toHaveAccessibleName(/^Collector 2/)
    expect(radios[2]).toBeDisabled()
    expect(screen.getByText("You can only sell works located in the US for now.")).toBeOnTheScreen()

    fireEvent.press(radios[2])
    expect(radios[2]).not.toBeChecked()
    expect(onAddress).toHaveBeenLastCalledWith(expect.objectContaining({ internalID: "3" }))

    fireEvent.press(screen.getByRole("radio", { name: /^Collector 1/ }))
    expect(screen.getByRole("radio", { name: /^Collector 1/ })).toBeChecked()
  })

  it("shows three addresses until the user asks for all of them", () => {
    renderWithRelay({
      Me: () => ({
        addressConnection: addressConnection(["1", "2", "3", "4"].map((id) => address(id))),
      }),
    })

    expect(screen.getAllByRole("radio")).toHaveLength(3)

    fireEvent.press(screen.getByText("Show all addresses (4)"))

    expect(screen.getAllByRole("radio")).toHaveLength(4)
    expect(screen.queryByText("Show all addresses (4)")).not.toBeOnTheScreen()
  })

  it("saves a new address and selects it", async () => {
    const view = renderWithRelay({
      Me: () => ({ id: "me", name: "Collector", addressConnection: addressConnection([]) }),
    })

    expect(screen.queryAllByRole("radio")).toHaveLength(0)

    fireEvent.press(screen.getByLabelText("Add new address"))
    expect(screen.getByText("Save Address")).toBeDisabled()

    fireEvent.press(screen.getByTestId("sell-street-address"))
    fireEvent.changeText(await screen.findByLabelText("Search addresses"), "401 Broad")
    fireEvent.press(await screen.findByText(PLACE.name))
    await waitFor(() => expect(screen.getByLabelText("Zip code")).toHaveDisplayValue("10013"))
    expect(getLocationPredictions).toHaveBeenCalledWith("401 Broad", {
      types: "address",
      country: "us",
    })

    fireEvent.press(screen.getByText("Save Address"))

    await waitFor(() =>
      expect(view.env.mock.getMostRecentOperation().request.variables.input).toEqual({
        attributes: {
          name: "Collector",
          addressLine1: "401 Broadway",
          city: "New York",
          region: "NY",
          postalCode: "10013",
          country: "US",
        },
      })
    )

    view.mockResolveLastOperation({
      CreateUserAddressPayload: () => ({
        // The same id as the query's Me, so the new address lands in the rendered list
        me: { id: "me", addressConnection: addressConnection([address("new-1")]) },
        userAddressOrErrors: { __typename: "UserAddress", internalID: "new-1" },
      }),
    })

    expect(await screen.findByRole("radio", { name: /^Collector new-1/ })).toBeChecked()
    expect(onAddress).toHaveBeenLastCalledWith(expect.objectContaining({ internalID: "new-1" }))
  })

  it("shows the error when the address can’t be saved", async () => {
    const view = renderWithRelay({
      Me: () => ({ id: "me", addressConnection: addressConnection([address("1")]) }),
    })

    fireEvent.press(screen.getByLabelText("Add new address"))
    fireEvent.press(screen.getByTestId("sell-street-address"))
    fireEvent.changeText(await screen.findByLabelText("Search addresses"), "401 Broad")
    fireEvent.press(await screen.findByText(PLACE.name))
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())

    fireEvent.press(screen.getByText("Save Address"))
    await waitFor(() =>
      expect(view.env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "useCreateUserAddressMutation"
      )
    )
    view.mockResolveLastOperation({
      CreateUserAddressPayload: () => ({
        me: { id: "me", addressConnection: addressConnection([address("1")]) },
        userAddressOrErrors: { __typename: "Errors", errors: [{ message: "Name is required" }] },
      }),
    })

    expect(await screen.findByText("Name is required")).toBeOnTheScreen()
    expect(screen.getByRole("radio", { name: /^Collector 1/ })).toBeChecked()
  })

  it("keeps only digits in the postal code", () => {
    renderWithRelay({ Me: () => ({ addressConnection: addressConnection([]) }) })

    fireEvent.press(screen.getByLabelText("Add new address"))
    fireEvent.changeText(screen.getByLabelText("Zip code"), "10a01")

    expect(screen.getByLabelText("Zip code")).toHaveDisplayValue("1001")
  })
})
