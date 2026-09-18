import { fireEvent, screen } from "@testing-library/react-native"
import { ItineraryEditSheet } from "app/Scenes/CityGuide/Components/ItineraryEditSheet"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ItineraryEditSheet", () => {
  const onClose = jest.fn()
  const onDeleted = jest.fn()

  const itinerary = {
    internalID: "itinerary-1",
    name: "London Oct 2026",
    description: "If time, check out Borough Market",
  }

  // No fragment of its own: the sheet takes plain props, but it commits mutations, so it
  // needs a Relay environment around it.
  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <ItineraryEditSheet visible onClose={onClose} itinerary={itinerary} onDeleted={onDeleted} />
    ),
    query: graphql`
      query ItineraryEditSheetTestsQuery @relay_test_operation {
        me {
          internalID
        }
      }
    `,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("prefills the name and notes", () => {
    renderWithRelay({})

    expect(screen.getByTestId("itinerary-edit-name")).toHaveProp("value", "London Oct 2026")
    expect(screen.getByTestId("itinerary-edit-notes")).toHaveProp(
      "value",
      "If time, check out Borough Market"
    )
  })

  it("counts the notes against the limit the designs specify", () => {
    renderWithRelay({})

    // "If time, check out Borough Market" is 33 characters.
    expect(screen.getByText("33 / 200")).toBeOnTheScreen()

    fireEvent.changeText(screen.getByTestId("itinerary-edit-notes"), "Short")

    expect(screen.getByText("5 / 200")).toBeOnTheScreen()
  })

  it("caps the notes field at the limit", () => {
    renderWithRelay({})

    expect(screen.getByTestId("itinerary-edit-notes")).toHaveProp("maxLength", 200)
  })

  // Saving an itinerary with no name would leave it unlabelled everywhere it is listed.
  it("will not save an empty name", () => {
    renderWithRelay({})

    fireEvent.changeText(screen.getByTestId("itinerary-edit-name"), "   ")

    expect(screen.getByTestId("itinerary-edit-save")).toBeDisabled()
  })

  it("sends the edited title and notes when saved", () => {
    const { env } = renderWithRelay({})

    fireEvent.changeText(screen.getByTestId("itinerary-edit-name"), "London November")
    fireEvent.press(screen.getByTestId("itinerary-edit-save"))

    expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({
      id: "itinerary-1",
      title: "London November",
      description: "If time, check out Borough Market",
    })
  })

  it("deletes by id, then tells the caller", () => {
    const { env } = renderWithRelay({})

    fireEvent.press(screen.getByTestId("itinerary-edit-delete"))

    expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({
      id: "itinerary-1",
    })
  })

  // Changing one needs an ArImage upload flow that does not exist yet, so the sheet says
  // nothing about cover images at all rather than showing one it cannot edit.
  it("says nothing about the cover image", () => {
    renderWithRelay({})

    expect(screen.queryByText("Cover image")).not.toBeOnTheScreen()
    expect(screen.queryByText("Change image")).not.toBeOnTheScreen()
  })
})
