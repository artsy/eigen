import { fireEvent, screen, waitFor } from "@testing-library/react-native"
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

jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
  getAddressFromCoordinates: jest.fn(),
}))

jest.mock("app/utils/getCurrentLocation", () => ({
  getCurrentLocation: jest.fn(),
}))

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
  fireEvent.press(screen.getByTestId("street-address"))
  fireEvent.changeText(await screen.findByLabelText("Search addresses"), query)
}

describe("AddressAutocomplete", () => {
  beforeEach(() => {
    ;(getLocationPredictions as jest.Mock).mockResolvedValue([ADDRESS])
    ;(getLocationDetails as jest.Mock).mockResolvedValue({ ...ADDRESS, postalCode: "10013" })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("searches addresses in the given country and shows the picked one in the field", async () => {
    const onChange = jest.fn()
    renderWithWrappers(<TestAddressAutocomplete onChange={onChange} />)

    await openSearch("401 Broad")
    fireEvent.press(await screen.findByText(ADDRESS.name))

    await waitFor(() => expect(onChange).toHaveBeenCalledWith({ ...ADDRESS, postalCode: "10013" }))
    expect(getLocationPredictions).toHaveBeenCalledWith("401 Broad", {
      types: "address",
      country: "us",
    })
    expect(screen.getByDisplayValue(ADDRESS.name)).toBeOnTheScreen()
  })

  it("fills the search with the picked address when reopened", async () => {
    renderWithWrappers(<TestAddressAutocomplete />)

    await openSearch("401 Broad")
    fireEvent.press(await screen.findByText(ADDRESS.name))
    await screen.findByDisplayValue(ADDRESS.name)

    fireEvent.press(screen.getByTestId("street-address"))

    await waitFor(() =>
      expect(screen.getByLabelText("Search addresses")).toHaveDisplayValue(ADDRESS.name)
    )
  })

  it("waits for three characters before searching", async () => {
    renderWithWrappers(<TestAddressAutocomplete />)

    await openSearch("40")

    await new Promise((resolve) => setTimeout(resolve, 400))
    expect(getLocationPredictions).not.toHaveBeenCalled()
  })

  it("says when no address matches", async () => {
    ;(getLocationPredictions as jest.Mock).mockResolvedValue([])
    renderWithWrappers(<TestAddressAutocomplete />)

    await openSearch("zzzz")

    expect(await screen.findByText("No matching addresses.")).toBeOnTheScreen()
  })

  describe("current location", () => {
    const HERE = { id: "place-2", name: "1 Main St, Brooklyn, NY, USA", countryCode: "US" }

    beforeEach(() => {
      ;(getCurrentLocation as jest.Mock).mockResolvedValue({ lat: 40.7, lng: -73.99 })
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

    it("says so when location access is denied", async () => {
      ;(getCurrentLocation as jest.Mock).mockResolvedValue(null)
      renderWithWrappers(<TestAddressAutocomplete />)

      fireEvent.press(screen.getByTestId("street-address"))
      fireEvent.press(await screen.findByText("Use Current Location"))

      expect(
        await screen.findByText("We couldn’t find an address for your current location.")
      ).toBeOnTheScreen()
      expect(getAddressFromCoordinates).not.toHaveBeenCalled()
    })
  })
})
