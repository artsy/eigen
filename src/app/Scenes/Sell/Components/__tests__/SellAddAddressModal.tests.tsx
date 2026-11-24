import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SellAddAddressModal } from "app/Scenes/Sell/Components/SellAddAddressModal"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { getLocationDetails, getLocationPredictions } from "app/utils/googleMaps"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { AccessibilityInfo } from "react-native"
import { MockPayloadGenerator } from "relay-test-utils"

jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
}))

// gorhom unmounts a sheet's content when it closes, but the global mock keeps it mounted
jest.mock("app/Components/BottomSheet/AutomountedBottomSheetModal", () => {
  const { createElement } = jest.requireActual("react")
  const { AutomountedBottomSheetModal } = jest.requireActual(
    "app/Components/BottomSheet/AutomountedBottomSheetModal"
  )
  return {
    AutomountedBottomSheetModal: (props: { visible: boolean }) =>
      props.visible ? createElement(AutomountedBottomSheetModal, props) : null,
  }
})

const PLACE = { id: "place-1", name: "401 Broadway, New York, NY, USA" }
const OTHER_PLACE = { id: "place-2", name: "Broadway, Albany, NY, USA" }

const onDismiss = jest.fn()
const onSaved = jest.fn()

const renderAddAddress = (name: string | null = "Collector") =>
  renderWithWrappers(
    <SellAddAddressModal visible name={name} onDismiss={onDismiss} onSaved={onSaved} />
  )

const pickPlace = async (place = PLACE) => {
  await fireEvent.press(screen.getByTestId("sell-street-address"))
  await fireEvent.changeText(await screen.findByLabelText("Search addresses"), "Broad")
  await fireEvent.press(await screen.findByText(place.name))
  await waitFor(() => expect(screen.queryByLabelText("Search addresses")).not.toBeOnTheScreen())
}

// What Android Back calls inside a native modal
const pressAndroidBack = () =>
  fireEvent(screen.getByTestId("sell-add-address-modal"), "requestClose")

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

  it("prefills the name and locks the country to the US", async () => {
    await renderAddAddress()

    expect(screen.getByLabelText("Full name")).toHaveDisplayValue("Collector")
    expect(screen.getByLabelText("Country")).toHaveDisplayValue("United States")
    expect(screen.getByLabelText("Country")).toHaveProp("editable", false)
  })

  it("fills the city, state and ZIP code from the picked street", async () => {
    await renderAddAddress()

    await pickPlace()

    expect(screen.getByLabelText("City")).toHaveDisplayValue("New York")
    expect(getLocationPredictions).toHaveBeenCalledWith("Broad", {
      types: "address",
      country: "us",
    })
    expect(screen.getByLabelText("State, region or province")).toHaveDisplayValue("NY")
    expect(screen.getByLabelText("ZIP/Postal code")).toHaveDisplayValue("10013-1234")
  })

  it("clears the fields the newly picked place doesn’t have", async () => {
    await renderAddAddress()
    await pickPlace()
    await fireEvent.changeText(screen.getByLabelText("Apt, floor, suite, etc."), "Floor 3")
    ;(getLocationPredictions as jest.Mock).mockResolvedValue([OTHER_PLACE])
    ;(getLocationDetails as jest.Mock).mockResolvedValue({
      ...OTHER_PLACE,
      street: "Broadway",
      stateCode: "NY",
      countryCode: "US",
    })
    await pickPlace(OTHER_PLACE)

    expect(screen.getByLabelText("City")).toHaveDisplayValue("")
    expect(screen.getByLabelText("ZIP/Postal code")).toHaveDisplayValue("")
    expect(screen.getByLabelText("Apt, floor, suite, etc.")).toHaveDisplayValue("")
  })

  it("asks for a street number when the picked street has none", async () => {
    ;(getLocationDetails as jest.Mock).mockResolvedValue({
      ...PLACE,
      street: "Broadway",
      city: "New York",
      stateCode: "NY",
      countryCode: "US",
      postalCode: "10013",
    })
    await renderAddAddress()

    await pickPlace()

    expect(screen.getByLabelText("Address line 1")).toHaveDisplayValue("Broadway")
    expect(await screen.findByText("Enter a street number.")).toBeOnTheScreen()
    expect(screen.getByText("Save Address")).toBeDisabled()

    await fireEvent.changeText(screen.getByLabelText("Address line 1"), "401")
    expect(await screen.findByText("Enter a street name.")).toBeOnTheScreen()
    expect(screen.getByText("Save Address")).toBeDisabled()

    await fireEvent.changeText(screen.getByLabelText("Address line 1"), "401 Broadway")
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())
  })

  it("doesn’t take a numbered street for a building number", async () => {
    await renderAddAddress()
    await pickPlace()

    await fireEvent.changeText(screen.getByLabelText("Address line 1"), "5th Avenue")
    expect(await screen.findByText("Enter a street number.")).toBeOnTheScreen()
    expect(screen.getByText("Save Address")).toBeDisabled()

    await fireEvent.changeText(screen.getByLabelText("Address line 1"), "1 5th Avenue")
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())
  })

  it("saves an address typed without the search", async () => {
    await renderAddAddress()

    await fireEvent.changeText(screen.getByLabelText("Address line 1"), "401 Broadway")
    await fireEvent.changeText(screen.getByLabelText("City"), "New York")
    await fireEvent.changeText(screen.getByLabelText("State, region or province"), "NY")
    await fireEvent.changeText(screen.getByLabelText("ZIP/Postal code"), "10013")
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())
    await fireEvent.press(screen.getByText("Save Address"))

    await waitFor(() =>
      expect(
        getMockRelayEnvironment().mock.getMostRecentOperation().request.variables.input.attributes
      ).toMatchObject({ addressLine1: "401 Broadway", city: "New York", postalCode: "10013" })
    )
    expect(getLocationPredictions).not.toHaveBeenCalled()
  })

  it("accepts street numbers that don’t lead the line", async () => {
    await renderAddAddress()
    await pickPlace()

    await fireEvent.changeText(screen.getByLabelText("Address line 1"), "W156 N8480 Pilgrim Rd")

    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())
  })

  it("keeps Save off until the required fields are filled", async () => {
    await renderAddAddress(null)

    await waitFor(() => expect(screen.getByText("Save Address")).toBeDisabled())

    await pickPlace()
    expect(screen.getByText("Save Address")).toBeDisabled()

    await fireEvent.changeText(screen.getByLabelText("Full name"), "Collector")
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())

    await fireEvent.changeText(screen.getByLabelText("ZIP/Postal code"), "10a0")
    expect(screen.getByLabelText("ZIP/Postal code")).toHaveDisplayValue("100")
    await waitFor(() => expect(screen.getByText("Save Address")).toBeDisabled())

    await fireEvent.changeText(screen.getByLabelText("ZIP/Postal code"), "10013")
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())
  })

  it("saves the address and hands it back", async () => {
    await renderAddAddress()

    await pickPlace()
    await fireEvent.changeText(screen.getByLabelText("Apt, floor, suite, etc."), "Floor 3")
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())
    await fireEvent.press(screen.getByText("Save Address"))

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
    await renderAddAddress()

    await pickPlace()
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())
    await fireEvent.press(screen.getByText("Save Address"))

    await waitFor(() =>
      expect(
        getMockRelayEnvironment().mock.getMostRecentOperation().request.node.operation.name
      ).toBe("useCreateUserAddressMutation")
    )
    resolveMutation({ __typename: "Errors", errors: [{ message: "Postal code is invalid" }] })

    expect(await screen.findByText("Postal code is invalid")).toBeOnTheScreen()
    expect(onSaved).not.toHaveBeenCalled()
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      "Postal code is invalid"
    )
  })

  it("stays open while saving", async () => {
    await renderAddAddress()

    await pickPlace()
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())
    await fireEvent.press(screen.getByText("Save Address"))
    await waitFor(() =>
      expect(
        getMockRelayEnvironment().mock.getMostRecentOperation().request.node.operation.name
      ).toBe("useCreateUserAddressMutation")
    )

    await pressAndroidBack()
    await fireEvent.press(screen.getByLabelText("Close"))

    expect(onDismiss).not.toHaveBeenCalled()
  })

  it("closes the street search before the form on Android Back", async () => {
    await renderAddAddress()

    await fireEvent.press(screen.getByTestId("sell-street-address"))
    expect(await screen.findByLabelText("Search addresses")).toBeOnTheScreen()

    await act(() => pressAndroidBack())
    await waitFor(() => expect(screen.queryByLabelText("Search addresses")).not.toBeOnTheScreen())
    expect(onDismiss).not.toHaveBeenCalled()

    await act(() => pressAndroidBack())
    expect(onDismiss).toHaveBeenCalled()
  })

  it("closes without saving", async () => {
    await renderAddAddress()

    await fireEvent.press(screen.getByLabelText("Close"))

    expect(onDismiss).toHaveBeenCalled()
    expect(onSaved).not.toHaveBeenCalled()
  })
})
