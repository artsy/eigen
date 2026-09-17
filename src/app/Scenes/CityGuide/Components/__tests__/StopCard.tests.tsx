import { screen } from "@testing-library/react-native"
import { StopCard } from "app/Scenes/CityGuide/Components/StopCard"
import { StopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const card = (overrides: Partial<StopCardFields> = {}): StopCardFields => ({
  kind: "custom",
  title: "Coffee at London Cafe",
  ...overrides,
})

describe("StopCard", () => {
  it("renders the title, subtitle, hours and admission with a dot between them", () => {
    renderWithWrappers(
      <StopCard
        card={card({ subtitle: "Cafe", hours: "7am-4pm", admission: "Free" })}
        image={null}
      />
    )

    expect(screen.getByText("Coffee at London Cafe")).toBeOnTheScreen()
    expect(screen.getByText("Cafe")).toBeOnTheScreen()
    expect(screen.getByText("7am-4pm")).toBeOnTheScreen()
    expect(screen.getByText("Free")).toBeOnTheScreen()
    expect(screen.getByTestId("stop-card-meta-dot")).toBeOnTheScreen()
  })

  it("shows no dot when only one of hours and admission is present", () => {
    renderWithWrappers(<StopCard card={card({ hours: "7am-4pm" })} image={null} />)

    expect(screen.queryByTestId("stop-card-meta-dot")).not.toBeOnTheScreen()
  })

  // An event's title carries both the event and the show it belongs to, which rarely fits one.
  it("gives the title two lines before truncating it", () => {
    renderWithWrappers(
      <StopCard card={card({ title: "Georg Baselitz: Back Again" })} image={null} />
    )

    expect(screen.getByText("Georg Baselitz: Back Again")).toHaveProp("numberOfLines", 2)
  })

  it("bolds an event's kind ahead of the show it belongs to", () => {
    renderWithWrappers(
      <StopCard
        card={card({ eventKind: "Closing Reception", title: "Georg Baselitz: Back Again" })}
        image={null}
      />
    )

    // One line of prose — the kind, a plain colon, then the show — wrapping as one.
    expect(screen.getByText("Closing Reception: Georg Baselitz: Back Again")).toHaveProp(
      "numberOfLines",
      2
    )
    // Only the kind is bold; the rest inherits the title's own weight.
    expect(screen.getByText("Closing Reception")).toHaveStyle({ fontWeight: "bold" })
  })

  it("renders the image when present, and nothing when absent", () => {
    const { rerender } = renderWithWrappers(
      <StopCard card={card()} image={{ url: "https://example.com/cafe.jpg" }} />
    )

    expect(screen.getByTestId("stop-card-image")).toBeOnTheScreen()

    rerender(<StopCard card={card()} image={null} />)

    expect(screen.queryByTestId("stop-card-image")).not.toBeOnTheScreen()
  })
})
