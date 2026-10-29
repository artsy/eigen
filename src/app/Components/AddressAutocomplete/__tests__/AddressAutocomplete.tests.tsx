import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { AddressAutocomplete } from "app/Components/AddressAutocomplete/AddressAutocomplete"
import {
  LocationWithDetails,
  getLocationDetails,
  getLocationPredictions,
} from "app/utils/googleMaps"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useState } from "react"

jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
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
})
