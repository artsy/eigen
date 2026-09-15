import { fireEvent, screen } from "@testing-library/react-native"
import { ShowPartnerLocation } from "app/Scenes/Show/Components/ShowPartnerLocation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockShowActionSheetWithOptions = jest.fn()

jest.mock("@expo/react-native-action-sheet", () => ({
  ...jest.requireActual("@expo/react-native-action-sheet"),
  useActionSheet: () => ({ showActionSheetWithOptions: mockShowActionSheetWithOptions }),
}))

// `tappedOnMap` builds its options object with a `cancelButtonIndex` getter that reads
// `this.options`. Babel's loose object-spread helper copies that getter by reading it, at
// which point `this` is a fragment without `options`, and it throws — under the test
// transform only. Stubbed here so this file tests the wiring it owns (press opens the sheet)
// rather than LocationMap's internals, which no test exercises today.
jest.mock("app/Components/LocationMap/LocationMap", () => ({
  ...jest.requireActual("app/Components/LocationMap/LocationMap"),
  tappedOnMap: jest.fn(() => [{ options: [], cancelButtonIndex: 0 }, jest.fn()]),
}))

describe("ShowPartnerLocation", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ({ show }: any) => <ShowPartnerLocation show={show} />,
    query: graphql`
      query ShowPartnerLocationTestsQuery @relay_test_operation {
        show(id: "a-show") {
          ...ShowPartnerLocation_show
        }
      }
    `,
  })

  const location = {
    display: "440 6th ave, Brooklyn, NY 11215",
    address: "440 6th ave",
    summary: null,
    city: "Brooklyn",
    postalCode: "11215",
    coordinates: { lat: 40.67, lng: -73.98 },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the partner name and its address", () => {
    renderWithRelay({
      Show: () => ({ partner: { name: "440 Gallery" }, location, fair: null }),
    })

    expect(screen.getByText("440 Gallery")).toBeOnTheScreen()
    expect(screen.getByText("440 6th ave, Brooklyn, NY 11215")).toBeOnTheScreen()
  })

  it("opens the directions sheet when the address is tapped", () => {
    renderWithRelay({
      Show: () => ({ partner: { name: "440 Gallery" }, location, fair: null }),
    })

    fireEvent.press(screen.getByTestId("show-partner-location-address"))

    expect(mockShowActionSheetWithOptions).toHaveBeenCalled()
  })

  // An empty grey band under the carousel reads as a rendering fault, so the whole block goes.
  it("renders nothing without an address", () => {
    renderWithRelay({
      Show: () => ({ partner: { name: "440 Gallery" }, location: null, fair: null }),
    })

    expect(screen.queryByText("440 Gallery")).not.toBeOnTheScreen()
  })

  it("renders nothing without a partner name", () => {
    renderWithRelay({
      Show: () => ({ partner: null, location, fair: null }),
    })

    expect(screen.queryByText("440 6th ave, Brooklyn, NY 11215")).not.toBeOnTheScreen()
  })

  // A show at a fair carries the fair's location rather than its own.
  it("falls back to the fair's location", () => {
    renderWithRelay({
      Show: () => ({
        partner: { name: "440 Gallery" },
        location: null,
        fair: { location: { ...location, display: "Somerset House, London" } },
      }),
    })

    expect(screen.getByText("Somerset House, London")).toBeOnTheScreen()
  })
})
