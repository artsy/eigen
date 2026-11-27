import { captureException } from "@sentry/react-native"
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { AddressAutocomplete } from "app/Components/AddressAutocomplete/AddressAutocomplete"
import { getCurrentLocation } from "app/utils/getCurrentLocation"
import {
  LocationWithDetails,
  getAddressFromCoordinates,
  getLocationDetails,
  getLocationPredictions,
} from "app/utils/googleMaps"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useState } from "react"
import { AccessibilityInfo, Alert, Linking } from "react-native"

jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
  getAddressFromCoordinates: jest.fn(),
}))

jest.mock("app/utils/getCurrentLocation", () => ({
  getCurrentLocation: jest.fn(),
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

const ADDRESS = { id: "place-1", name: "401 Broadway, New York, NY, USA" }

const TestAddressAutocomplete: React.FC<{ onChange?: (address: LocationWithDetails) => void }> = ({
  onChange,
}) => {
  const [address, setAddress] = useState<LocationWithDetails | null>(null)

  return (
    <AddressAutocomplete
      title="Street address"
      testID="street-address"
      country="us"
      value={address}
      onChange={(newAddress) => {
        setAddress(newAddress)
        onChange?.(newAddress)
      }}
    />
  )
}

const openSearch = async (query: string) => {
  await fireEvent.press(screen.getByTestId("street-address"))
  await fireEvent.changeText(await screen.findByLabelText("Search addresses"), query)
}

describe("AddressAutocomplete", () => {
  beforeEach(() => {
    ;(getLocationPredictions as jest.Mock).mockResolvedValue([ADDRESS])
    ;(getLocationDetails as jest.Mock).mockResolvedValue({ ...ADDRESS, postalCode: "10013" })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it("searches addresses in the given country and shows the picked one in the field", async () => {
    const onChange = jest.fn()
    await renderWithWrappers(<TestAddressAutocomplete onChange={onChange} />)

    await openSearch("401 Broad")
    await fireEvent.press(await screen.findByText(ADDRESS.name))

    await waitFor(() => expect(onChange).toHaveBeenCalledWith({ ...ADDRESS, postalCode: "10013" }))
    expect(getLocationPredictions).toHaveBeenCalledWith("401 Broad", {
      types: "address",
      country: "us",
    })
    expect(screen.getByDisplayValue(ADDRESS.name)).toBeOnTheScreen()
  })

  it("fills the search with the picked address when reopened", async () => {
    await renderWithWrappers(<TestAddressAutocomplete />)

    await openSearch("401 Broad")
    await fireEvent.press(await screen.findByText(ADDRESS.name))
    await screen.findByDisplayValue(ADDRESS.name)

    await fireEvent.press(screen.getByTestId("street-address"))

    await waitFor(() =>
      expect(screen.getByLabelText("Search addresses")).toHaveDisplayValue(ADDRESS.name)
    )
  })

  it("waits for three characters before searching", async () => {
    await renderWithWrappers(<TestAddressAutocomplete />)

    await openSearch("40")

    await new Promise((resolve) => setTimeout(resolve, 400))
    expect(getLocationPredictions).not.toHaveBeenCalled()
  })

  it("says when no address matches", async () => {
    ;(getLocationPredictions as jest.Mock).mockResolvedValue([])
    await renderWithWrappers(<TestAddressAutocomplete />)

    await openSearch("zzzz")

    expect(await screen.findByText("No matching addresses.")).toBeOnTheScreen()
  })

  describe("current location", () => {
    const HERE = { id: "place-2", name: "1 Main St, Brooklyn, NY, USA", countryCode: "US" }

    beforeEach(() => {
      ;(getCurrentLocation as jest.Mock).mockResolvedValue({
        status: "located",
        location: { lat: 40.7, lng: -73.99 },
      })
    })

    it("fills the search with the device's address, without picking it", async () => {
      ;(getAddressFromCoordinates as jest.Mock).mockResolvedValue(HERE)
      const onChange = jest.fn()
      renderWithWrappers(<TestAddressAutocomplete onChange={onChange} />)

      fireEvent.press(screen.getByTestId("street-address"))
      fireEvent.press(await screen.findByText("Use Current Location"))

      await waitFor(() =>
        expect(screen.getByLabelText("Search addresses")).toHaveDisplayValue(HERE.name)
      )
      expect(getAddressFromCoordinates).toHaveBeenCalledWith({ lat: 40.7, lng: -73.99 })
      expect(onChange).not.toHaveBeenCalled()
    })

    it("hides the option once the user types", async () => {
      renderWithWrappers(<TestAddressAutocomplete />)

      await openSearch("401 Broad")

      await waitFor(() => expect(screen.queryByText("Use Current Location")).not.toBeOnTheScreen())
    })

    it("says so when the location is outside the country", async () => {
      ;(getAddressFromCoordinates as jest.Mock).mockResolvedValue({ ...HERE, countryCode: "FR" })
      const onChange = jest.fn()
      renderWithWrappers(<TestAddressAutocomplete onChange={onChange} />)

      fireEvent.press(screen.getByTestId("street-address"))
      fireEvent.press(await screen.findByText("Use Current Location"))

      expect(
        await screen.findByText(
          "It looks like you’re not in the US. We only accept US addresses for now."
        )
      ).toBeOnTheScreen()
      expect(screen.getByLabelText("Search addresses")).toHaveDisplayValue("")
      expect(onChange).not.toHaveBeenCalled()
    })

    it("says so when the device can’t find its position", async () => {
      ;(getCurrentLocation as jest.Mock).mockResolvedValue({ status: "unavailable" })
      renderWithWrappers(<TestAddressAutocomplete />)

      fireEvent.press(screen.getByTestId("street-address"))
      fireEvent.press(await screen.findByText("Use Current Location"))

      expect(
        await screen.findByText("We couldn’t find an address for your current location.")
      ).toBeOnTheScreen()
      expect(getAddressFromCoordinates).not.toHaveBeenCalled()
      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        "We couldn’t find an address for your current location."
      )
    })

    it("does nothing when the user declines the prompt", async () => {
      ;(getCurrentLocation as jest.Mock).mockResolvedValue({ status: "denied" })
      const alert = jest.spyOn(Alert, "alert")
      renderWithWrappers(<TestAddressAutocomplete />)

      fireEvent.press(screen.getByTestId("street-address"))
      fireEvent.press(await screen.findByText("Use Current Location"))

      await waitFor(() => expect(getCurrentLocation).toHaveBeenCalled())
      expect(
        screen.queryByText("We couldn’t find an address for your current location.")
      ).not.toBeOnTheScreen()
      expect(alert).not.toHaveBeenCalled()
      expect(getAddressFromCoordinates).not.toHaveBeenCalled()
    })

    it("points to Settings when location was blocked before", async () => {
      ;(getCurrentLocation as jest.Mock).mockResolvedValue({ status: "blocked" })
      const alert = jest.spyOn(Alert, "alert").mockImplementation(() => null)
      const openSettings = jest.spyOn(Linking, "openSettings").mockResolvedValue()
      renderWithWrappers(<TestAddressAutocomplete />)

      fireEvent.press(screen.getByTestId("street-address"))
      fireEvent.press(await screen.findByText("Use Current Location"))

      await waitFor(() =>
        expect(alert).toHaveBeenCalledWith(
          "Allow access to your location",
          "To use your current location, allow Artsy to access your location in Settings.",
          expect.any(Array)
        )
      )
      const buttons = alert.mock.calls[0][2]
      buttons?.find((button) => button.text === "Open Settings")?.onPress?.()
      expect(openSettings).toHaveBeenCalled()
      expect(getAddressFromCoordinates).not.toHaveBeenCalled()
    })

    it("asks for precise location when only approximate is allowed", async () => {
      ;(getCurrentLocation as jest.Mock).mockResolvedValue({ status: "approximate" })
      renderWithWrappers(<TestAddressAutocomplete />)

      fireEvent.press(screen.getByTestId("street-address"))
      fireEvent.press(await screen.findByText("Use Current Location"))

      expect(
        await screen.findByText("Turn on precise location to use your current address.")
      ).toBeOnTheScreen()
      expect(getAddressFromCoordinates).not.toHaveBeenCalled()
    })

    it("logs a failed lookup and shows the same message", async () => {
      const error = new Error("Network request failed")
      ;(getAddressFromCoordinates as jest.Mock).mockRejectedValue(error)
      renderWithWrappers(<TestAddressAutocomplete />)

      fireEvent.press(screen.getByTestId("street-address"))
      fireEvent.press(await screen.findByText("Use Current Location"))

      expect(
        await screen.findByText("We couldn’t find an address for your current location.")
      ).toBeOnTheScreen()
      expect(captureException).toHaveBeenCalledWith(error)
    })

    it("starts from the picked address, not the last location, when reopened", async () => {
      ;(getAddressFromCoordinates as jest.Mock).mockResolvedValue(HERE)
      renderWithWrappers(<TestAddressAutocomplete />)

      fireEvent.press(screen.getByTestId("street-address"))
      fireEvent.press(await screen.findByText("Use Current Location"))
      await waitFor(() =>
        expect(screen.getByLabelText("Search addresses")).toHaveDisplayValue(HERE.name)
      )
      fireEvent.press(await screen.findByText(ADDRESS.name))
      await screen.findByDisplayValue(ADDRESS.name)

      fireEvent.press(screen.getByTestId("street-address"))

      await waitFor(() =>
        expect(screen.getByLabelText("Search addresses")).toHaveDisplayValue(ADDRESS.name)
      )
    })

    it("drops a lookup that finishes after the sheet closed", async () => {
      let resolveAddress: (address: typeof HERE) => void = () => null
      ;(getAddressFromCoordinates as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolveAddress = resolve
        })
      )
      renderWithWrappers(<TestAddressAutocomplete />)

      fireEvent.press(screen.getByTestId("street-address"))
      fireEvent.press(await screen.findByText("Use Current Location"))
      await waitFor(() => expect(getAddressFromCoordinates).toHaveBeenCalled())
      // What a swipe down calls
      act(() => screen.UNSAFE_getByProps({ sentryName: "AddressSearchSheet" }).props.onDismiss())
      await waitFor(() => expect(screen.queryByLabelText("Search addresses")).not.toBeOnTheScreen())

      await act(async () => resolveAddress(HERE))
      fireEvent.press(screen.getByTestId("street-address"))

      expect(await screen.findByLabelText("Search addresses")).toHaveDisplayValue("")
    })

    it("doesn’t look up the address once the user types while locating", async () => {
      let resolveLocation: (location: unknown) => void = () => null
      ;(getCurrentLocation as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolveLocation = resolve
        })
      )
      renderWithWrappers(<TestAddressAutocomplete />)

      fireEvent.press(screen.getByTestId("street-address"))
      fireEvent.press(await screen.findByText("Use Current Location"))
      fireEvent.changeText(screen.getByLabelText("Search addresses"), "401 Broad")

      await act(async () =>
        resolveLocation({ status: "located", location: { lat: 40.7, lng: -73.99 } })
      )

      expect(getAddressFromCoordinates).not.toHaveBeenCalled()
      expect(screen.getByLabelText("Search addresses")).toHaveDisplayValue("401 Broad")
    })

    it("keeps what the user typed while the location was loading", async () => {
      let resolveAddress: (address: typeof HERE) => void = () => null
      ;(getAddressFromCoordinates as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolveAddress = resolve
        })
      )
      renderWithWrappers(<TestAddressAutocomplete />)

      fireEvent.press(screen.getByTestId("street-address"))
      fireEvent.press(await screen.findByText("Use Current Location"))
      await waitFor(() => expect(getAddressFromCoordinates).toHaveBeenCalled())
      fireEvent.changeText(screen.getByLabelText("Search addresses"), "401 Broad")

      await act(async () => resolveAddress(HERE))

      expect(screen.getByLabelText("Search addresses")).toHaveDisplayValue("401 Broad")
      expect(getLocationPredictions).toHaveBeenLastCalledWith("401 Broad", {
        types: "address",
        country: "us",
      })
    })
  })
})
