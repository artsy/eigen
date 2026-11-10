import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SellLocationFields } from "app/Scenes/Sell/Components/SellLocationFields"
import { SellLocationStore } from "app/Scenes/Sell/State/SellLocationStore"
import { getLocationDetails, getLocationPredictions } from "app/utils/googleMaps"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
}))

const ADDRESS = { id: "place-1", name: "401 Broadway, New York, NY, USA" }

const TestLocationFields: React.FC = () => (
  <SellLocationStore.Provider>
    <SellLocationFields />
  </SellLocationStore.Provider>
)

describe("SellLocationFields", () => {
  beforeEach(() => {
    ;(getLocationPredictions as jest.Mock).mockResolvedValue([ADDRESS])
    ;(getLocationDetails as jest.Mock).mockResolvedValue({ ...ADDRESS, postalCode: "10013" })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("fills the zip from the picked US address", async () => {
    renderWithWrappers(<TestLocationFields />)

    fireEvent.press(screen.getByTestId("sell-street-address"))
    fireEvent.changeText(await screen.findByLabelText("Search addresses"), "401 Broad")
    fireEvent.press(await screen.findByText(ADDRESS.name))

    await waitFor(() => expect(screen.getByLabelText("Zip code")).toHaveDisplayValue("10013"))
    expect(screen.getByText(ADDRESS.name)).toBeOnTheScreen()
    expect(getLocationPredictions).toHaveBeenCalledWith("401 Broad", {
      types: "address",
      country: "us",
    })
  })

  it("keeps only digits in the zip", () => {
    renderWithWrappers(<TestLocationFields />)

    fireEvent.changeText(screen.getByLabelText("Zip code"), "10a01")

    expect(screen.getByLabelText("Zip code")).toHaveDisplayValue("1001")
  })
})
