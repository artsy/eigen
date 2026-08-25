import { screen } from "@testing-library/react-native"
import { Event } from "app/Scenes/City/Components/Event/Event"
import { Show } from "app/utils/cityGuide/types"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const eventData = {
  name: "PALAY, Trapunto Murals by Pacita Abad",
  id: "U2hvdzpwYWNpdGEtYWJhZC1hcnQtZXN0YXRlLXBhbGF5LXRyYXB1bnRvLW11cmFscy1ieS1wYWNpdGEtYWJhZA==",
  internalID: "1234567",
  slug: "pacita-abad-art-estate-palay-trapunto-murals-by-pacita-abad",
  is_followed: true,
  end_at: "2001-12-15T12:00:00+00:00",
  start_at: "2001-11-12T12:00:00+00:00",
  exhibition_period: "Feb 11 - 12",
  partner: {
    name: "Pacita Abad Art Estate",
  },
} as any as Show

describe("Event", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: Event,
  })

  it("renders properly", () => {
    renderWithRelay({}, { event: eventData })

    expect(screen.getByText("Pacita Abad Art Estate")).toBeTruthy()
  })

  it("renders a rail of artworks from the show", async () => {
    renderWithRelay(
      {
        Show: () => ({
          artworksConnection: {
            edges: [
              {
                node: {
                  artistNames: "Pacita Abad",
                },
              },
            ],
          },
        }),
      },
      { event: eventData }
    )

    expect(await screen.findByText("Pacita Abad")).toBeTruthy()
  })
})
