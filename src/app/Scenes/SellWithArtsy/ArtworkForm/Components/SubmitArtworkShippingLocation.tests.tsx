import { useIsFocused, useNavigation } from "@react-navigation/native"
import { fireEvent, screen } from "@testing-library/react-native"
import { COUNTRY_SELECT_OPTIONS } from "app/Components/CountrySelect"
import { SubmitArtworkShippingLocation } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkShippingLocation"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"

jest.mock(
  "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission",
  () => ({
    createOrUpdateSubmission: jest.fn(() => Promise.resolve()),
  })
)

const mockNavigate = jest.fn()

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(),
  useIsFocused: jest.fn(),
}))

describe("SubmitArtworkShippingLocation", () => {
  const useNavigationMock = useNavigation as jest.Mock
  const useIsFocusedMock = useIsFocused as jest.Mock

  beforeEach(() => {
    useIsFocusedMock.mockReturnValue(() => true)
    useNavigationMock.mockReturnValue({
      navigate: mockNavigate,
    })
  })

  it("renders only the country select when all other fields are empty", async () => {
    renderWithSubmitArtworkWrapper({
      props: { currentStep: "ShippingLocation" },
      component: <SubmitArtworkShippingLocation />,
    })

    const countrySelect = screen.getByTestId("country-select")
    expect(countrySelect).toBeOnTheScreen()

    expect(screen.queryByText("Address Line 1")).not.toBeOnTheScreen()

    expect(screen.queryByText("Address Line 2")).not.toBeOnTheScreen()

    expect(screen.queryByText("City")).not.toBeOnTheScreen()

    expect(screen.queryByText("Postal Code")).not.toBeOnTheScreen()

    expect(screen.queryByText("State, Province, or Region")).not.toBeOnTheScreen()
  })

  it("renders all field if a country is available", async () => {
    renderWithSubmitArtworkWrapper({
      props: { currentStep: "ShippingLocation" },
      component: <SubmitArtworkShippingLocation />,
    })

    const countrySelect = screen.getByTestId("country-select")
    expect(countrySelect).toBeOnTheScreen()

    fireEvent.press(countrySelect)
    // Wait for the select modal to show up
    await flushPromiseQueue()

    fireEvent.press(screen.getByText(COUNTRY_SELECT_OPTIONS[0].label as string))

    expect(screen.getAllByText(COUNTRY_SELECT_OPTIONS[0].label as string)).toHaveLength(2)

    expect(screen.getByText("Address Line 1")).toBeOnTheScreen()

    expect(screen.getByText("Address Line 2")).toBeOnTheScreen()

    expect(screen.getByText("City")).toBeOnTheScreen()

    expect(screen.getByText("Postal Code")).toBeOnTheScreen()

    expect(screen.getByText("State, Province, or Region")).toBeOnTheScreen()
  })

  it("calls createOrUpdateSubmission and goes to next step when continue is pressed", async () => {
    renderWithSubmitArtworkWrapper({
      props: { currentStep: "ShippingLocation" },
      component: <SubmitArtworkShippingLocation />,
      injectedFormikProps: {
        location: {
          country: "Germany",
          countryCode: "DE",
          address: "Street 1",
          address2: "5th Floor",
          city: "Friedrichshain",
          state: "Berlin",
          zipCode: "10115",
        },
      },
    })

    fireEvent.press(screen.getByTestId("country-select"))

    await flushPromiseQueue()

    expect(screen.getByText("Germany")).toBeOnTheScreen()
    expect(screen.getByDisplayValue("Street 1")).toBeOnTheScreen()
    expect(screen.getByDisplayValue("5th Floor")).toBeOnTheScreen()
    expect(screen.getByDisplayValue("Friedrichshain")).toBeOnTheScreen()
    expect(screen.getByDisplayValue("10115")).toBeOnTheScreen()
    expect(screen.getByDisplayValue("Berlin")).toBeOnTheScreen()

    // Wait for validation to finish
    await flushPromiseQueue()

    fireEvent(screen.getByText("Continue"), "onPress")

    expect(createOrUpdateSubmission).toHaveBeenCalledWith(
      {
        location: {
          address: "Street 1",
          address2: "5th Floor",
          city: "Friedrichshain",
          country: "Germany",
          countryCode: "DE",
          state: "Berlin",
          zipCode: "10115",
        },
      },
      null
    )
    await flushPromiseQueue()

    expect(mockNavigate).toHaveBeenCalledWith("FrameInformation")
  })
})
