import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import {
  EMPTY_SELL_LOCATION,
  SellLocation,
  SellLocationFields,
  isSellLocationComplete,
} from "app/Scenes/Sell/Components/SellLocationFields"
import { getLocationDetails, getLocationPredictions } from "app/utils/googleMaps"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useState } from "react"

jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
}))

const ADDRESS = { id: "place-1", name: "401 Broadway, New York, NY, USA" }

const TestLocationFields: React.FC<{ onLocation: (location: SellLocation) => void }> = ({
  onLocation,
}) => {
  const [location, setLocation] = useState(EMPTY_SELL_LOCATION)

  return (
    <SellLocationFields
      value={location}
      onChange={(update) =>
        setLocation((current) => {
          const next = typeof update === "function" ? update(current) : update
          onLocation(next)
          return next
        })
      }
    />
  )
}

describe("SellLocationFields", () => {
  beforeEach(() => {
    ;(getLocationPredictions as jest.Mock).mockResolvedValue([ADDRESS])
    ;(getLocationDetails as jest.Mock).mockResolvedValue({ ...ADDRESS, postalCode: "10013" })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("searches US street addresses and fills the zip from the picked one", async () => {
    const onLocation = jest.fn()
    renderWithWrappers(<TestLocationFields onLocation={onLocation} />)

    fireEvent.changeText(screen.getByLabelText("Street address"), "401 Broad")
    fireEvent.press(await screen.findByTestId("autocomplete-location-prediction-place-1"))

    await waitFor(() => expect(screen.getByLabelText("Zip code")).toHaveDisplayValue("10013"))
    expect(getLocationPredictions).toHaveBeenCalledWith("401 Broad", {
      types: "address",
      country: "us",
    })
    expect(isSellLocationComplete(onLocation.mock.lastCall[0])).toBe(true)
  })

  it("keeps only digits in the zip", () => {
    renderWithWrappers(<TestLocationFields onLocation={jest.fn()} />)

    fireEvent.changeText(screen.getByLabelText("Zip code"), "10a01")

    expect(screen.getByLabelText("Zip code")).toHaveDisplayValue("1001")
  })
})

describe("isSellLocationComplete", () => {
  it("needs a picked address and a five digit zip", () => {
    expect(isSellLocationComplete({ address: ADDRESS, zip: "10013" })).toBe(true)
    expect(isSellLocationComplete({ address: ADDRESS, zip: "1001" })).toBe(false)
    expect(isSellLocationComplete({ address: null, zip: "10013" })).toBe(false)
  })

  it("treats typed text that matched no suggestion as incomplete", () => {
    // LocationAutocomplete reports typed text without an id when allowCustomLocation is set
    const typedAddress = { city: "401 Broadway" } as SellLocation["address"]

    expect(isSellLocationComplete({ address: typedAddress, zip: "10013" })).toBe(false)
  })
})
