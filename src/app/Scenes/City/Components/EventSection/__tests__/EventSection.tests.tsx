import { screen } from "@testing-library/react-native"
import { EventSection } from "app/Scenes/City/Components/EventSection/EventSection"
import { Show } from "app/utils/cityGuide/types"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const data = [
  {
    name: "PALAY, Trapunto Murals by Pacita Abad",
    id: "U2hvdzpwYWNpdGEtYWJhZC1hcnQtZXN0YXRlLXBhbGF5LXRyYXB1bnRvLW11cmFscy1ieS1wYWNpdGEtYWJhZA==",
    gravityID: "pacita-abad-art-estate-palay-trapunto-murals-by-pacita-abad",
    cover_image: {
      url: "",
    },
    end_at: "2001-12-15T12:00:00+00:00",
    start_at: "2001-11-12T12:00:00+00:00",
    partner: {
      name: "Pacita Abad Art Estate",
    },
  },
] as any as Show[]

describe("CityEvent", () => {
  it("renders properly", () => {
    renderWithWrappers(
      <EventSection title="Gallery shows" section="galleries" citySlug="new-york" data={data} />
    )

    expect(screen.getByText("Gallery shows")).toBeTruthy()
  })
})
