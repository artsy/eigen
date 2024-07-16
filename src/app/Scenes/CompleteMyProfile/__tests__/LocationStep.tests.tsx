import { screen, fireEvent, waitFor } from "@testing-library/react-native"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { LocationStep } from "app/Scenes/CompleteMyProfile/LocationStep"
import * as useCompleteProfile from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { getLocationDetails, getLocationPredictions } from "app/utils/googleMaps"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
}))

describe("LocationStep", () => {
  const setProgressState = jest.fn()
  ;(jest.spyOn(useCompleteProfile, "useCompleteProfile") as jest.SpyInstance<any>).mockReturnValue({
    goNext: jest.fn(),
  })
  jest
    .spyOn(CompleteMyProfileStore, "useStoreActions")
    .mockImplementation((callback) => callback({ setProgressState } as any))
  const stateSpy = jest
    .spyOn(CompleteMyProfileStore, "useStoreState")
    .mockImplementation((callback) => callback({ progressState: {} } as any))

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getLocationPredictions as jest.Mock).mockResolvedValue(locationPredictions)
    ;(getLocationDetails as jest.Mock).mockResolvedValue(locationDetails)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders", () => {
    renderWithWrappers(<LocationStep />)

    expect(screen.getByText("Add your primary location")).toBeOnTheScreen()
    expect(
      screen.getByText(
        "Receive recommendations for local galleries, shows, and offers on artworks."
      )
    ).toBeOnTheScreen()
    expect(screen.getByLabelText("Enter your primary location")).toBeOnTheScreen()
  })

  it("calls setProgressState on input change", async () => {
    renderWithWrappers(<LocationStep />)

    const input = screen.getByLabelText("Enter your primary location")

    fireEvent(input, "focus")
    fireEvent(input, "changeText", "Busy")

    await screen.findByTestId("autocomplete-location-prediction-a")

    fireEvent.press(screen.getByTestId("autocomplete-location-prediction-a"))

    await waitFor(() =>
      expect(setProgressState).toHaveBeenCalledWith({
        type: "location",
        value: locationDetails,
      })
    )
  })

  it("shows the input value from field state", () => {
    stateSpy.mockImplementation((callback) =>
      callback({ progressState: { location: locationDetails } } as any)
    )

    renderWithWrappers(<LocationStep />)

    expect(screen.getByLabelText("Enter your primary location").props.value).toBe(
      "Busytown, CA, USA"
    )
  })
})

const locationPredictions = [
  { id: "a", name: "Busytown, USA" },
  { id: "b", name: "Hello, USA" },
]

const locationDetails = {
  city: "Busytown",
  coordinates: [1, 2],
  country: "USA",
  postalCode: "12345",
  state: "CA",
  stateCode: "CA",
}
