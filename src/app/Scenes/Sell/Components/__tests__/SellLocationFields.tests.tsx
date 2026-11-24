import { fireEvent, screen } from "@testing-library/react-native"
import { SellLocationFieldsTestQuery } from "__generated__/SellLocationFieldsTestQuery.graphql"
import { SellLocationFields } from "app/Scenes/Sell/Components/SellLocationFields"
import { SellLocationStore, SellSavedAddress } from "app/Scenes/Sell/State/SellLocationStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { useEffect } from "react"
import { graphql } from "react-relay"

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
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("lists the default US address first and selected, and greys out other countries", async () => {
    await renderWithRelay({
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

    await fireEvent.press(radios[2])
    expect(radios[2]).not.toBeChecked()
    expect(onAddress).toHaveBeenLastCalledWith(expect.objectContaining({ internalID: "3" }))

    await fireEvent.press(screen.getByRole("radio", { name: /^Collector 1/ }))
    expect(screen.getByRole("radio", { name: /^Collector 1/ })).toBeChecked()
  })

  it("shows three addresses until the user asks for all of them", async () => {
    await renderWithRelay({
      Me: () => ({
        addressConnection: addressConnection(["1", "2", "3", "4"].map((id) => address(id))),
      }),
    })

    expect(screen.getAllByRole("radio")).toHaveLength(3)

    await fireEvent.press(screen.getByText("Show all addresses (4)"))

    expect(screen.getAllByRole("radio")).toHaveLength(4)
    expect(screen.queryByText("Show all addresses (4)")).not.toBeOnTheScreen()
  })
})
