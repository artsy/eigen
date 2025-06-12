import { Event } from "app/Scenes/City/Components/Event/Event"
import { Show } from "app/Scenes/Map/types"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const eventData = {
  name: "PALAY, Trapunto Murals by Pacita Abad",
  id: "U2hvdzpwYWNpdGEtYWJhZC1hcnQtZXN0YXRlLXBhbGF5LXRyYXB1bnRvLW11cmFscy1ieS1wYWNpdGEtYWJhZA==",
  internalID: "1234567",
  gravityID: "pacita-abad-art-estate-palay-trapunto-murals-by-pacita-abad",
  cover_image: {
    url: "",
  },
  is_followed: true,
  end_at: "2001-12-15T12:00:00+00:00",
  start_at: "2001-11-12T12:00:00+00:00",
  exhibition_period: "Feb 11 - 12",
  partner: {
    name: "Pacita Abad Art Estate",
  },
} as any as Show

describe("CityEvent", () => {
  it("renders properly", () => {
    const { queryByText } = renderWithWrappers(<Event event={eventData} />)

    expect(queryByText("Pacita Abad Art Estate")).toBeTruthy()
  })
})
