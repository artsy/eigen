import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SellAddAddressModal } from "app/Scenes/Sell/Components/SellAddAddressModal"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { getLocationDetails, getLocationPredictions } from "app/utils/googleMaps"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { MockPayloadGenerator } from "relay-test-utils"

jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
}))

const PLACE = { id: "place-1", name: "401 Broadway, New York, NY, USA" }

const onDismiss = jest.fn()
const onSaved = jest.fn()

const renderAddAddress = (name: string | null = "Collector") =>
  renderWithWrappers(
    <SellAddAddressModal visible name={name} onDismiss={onDismiss} onSaved={onSaved} />
  )

const pickPlace = async () => {
  fireEvent.press(screen.getByTestId("sell-street-address"))
  fireEvent.changeText(await screen.findByLabelText("Search addresses"), "401 Broad")
  fireEvent.press(await screen.findByText(PLACE.name))
  await waitFor(() => expect(screen.getByLabelText("City")).toHaveDisplayValue("New York"))
}

const resolveMutation = (userAddressOrErrors: object) => {
  const env = getMockRelayEnvironment()
  const operation = env.mock.getMostRecentOperation()
  env.mock.resolve(
    operation,
    MockPayloadGenerator.generate(operation, {
      CreateUserAddressPayload: () => ({ userAddressOrErrors }),
    })
  )
}

describe("SellAddAddressModal", () => {
  beforeEach(() => {
    ;(getLocationPredictions as jest.Mock).mockResolvedValue([PLACE])
    ;(getLocationDetails as jest.Mock).mockResolvedValue({
      ...PLACE,
      street: "401 Broadway",
      city: "New York",
      stateCode: "NY",
      countryCode: "US",
      postalCode: "10013-1234",
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("prefills the name and locks the country to the US", () => {
    renderAddAddress()

    expect(screen.getByLabelText("Full name")).toHaveDisplayValue("Collector")
    expect(screen.getByLabelText("Country")).toHaveDisplayValue("United States")
    expect(screen.getByLabelText("Country")).toHaveProp("editable", false)
  })

  it("fills the city, state and ZIP code from the picked street", async () => {
    renderAddAddress()

    await pickPlace()

    expect(getLocationPredictions).toHaveBeenCalledWith("401 Broad", {
      types: "address",
      country: "us",
    })
    expect(screen.getByLabelText("State, region or province")).toHaveDisplayValue("NY")
    expect(screen.getByLabelText("ZIP/Postal code")).toHaveDisplayValue("10013-1234")
  })

  it("keeps Save off until the required fields are filled", async () => {
    renderAddAddress(null)

    await waitFor(() => expect(screen.getByText("Save Address")).toBeDisabled())

    await pickPlace()
    expect(screen.getByText("Save Address")).toBeDisabled()

    fireEvent.changeText(screen.getByLabelText("Full name"), "Collector")
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())

    fireEvent.changeText(screen.getByLabelText("ZIP/Postal code"), "10a0")
    expect(screen.getByLabelText("ZIP/Postal code")).toHaveDisplayValue("100")
    await waitFor(() => expect(screen.getByText("Save Address")).toBeDisabled())

    fireEvent.changeText(screen.getByLabelText("ZIP/Postal code"), "10013")
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())
  })

  it("saves the address and hands it back", async () => {
    renderAddAddress()

    await pickPlace()
    fireEvent.changeText(screen.getByLabelText("Apt, floor, suite, etc."), "Floor 3")
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())
    fireEvent.press(screen.getByText("Save Address"))

    await waitFor(() =>
      expect(
        getMockRelayEnvironment().mock.getMostRecentOperation().request.variables.input
      ).toEqual({
        attributes: {
          name: "Collector",
          addressLine1: "401 Broadway",
          addressLine2: "Floor 3",
          city: "New York",
          region: "NY",
          postalCode: "10013-1234",
          country: "US",
        },
      })
    )
    resolveMutation({ __typename: "UserAddress", internalID: "new-1" })

    await waitFor(() => expect(onSaved).toHaveBeenCalledWith("new-1"))
    expect(onDismiss).toHaveBeenCalled()
  })

  it("shows the error when the address can’t be saved", async () => {
    renderAddAddress()

    await pickPlace()
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())
    fireEvent.press(screen.getByText("Save Address"))

    await waitFor(() =>
      expect(
        getMockRelayEnvironment().mock.getMostRecentOperation().request.node.operation.name
      ).toBe("useCreateUserAddressMutation")
    )
    resolveMutation({ __typename: "Errors", errors: [{ message: "Postal code is invalid" }] })

    expect(await screen.findByText("Postal code is invalid")).toBeOnTheScreen()
    expect(onSaved).not.toHaveBeenCalled()
  })

  it("closes without saving", () => {
    renderAddAddress()

    fireEvent.press(screen.getByLabelText("Close"))

    expect(onDismiss).toHaveBeenCalled()
    expect(onSaved).not.toHaveBeenCalled()
  })
})
