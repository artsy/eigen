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

  it("centers the row on the cross axis, so the save control lines up with the title", () => {
    renderWithWrappers(<StopCard card={card()} image={null} />)

    expect(screen.getByTestId("stop-card")).toHaveStyle({ alignItems: "center" })
  })

  it("shows no dot when only one of hours and admission is present", () => {
    renderWithWrappers(<StopCard card={card({ hours: "7am-4pm" })} image={null} />)

    expect(screen.queryByTestId("stop-card-meta-dot")).not.toBeOnTheScreen()
  })

  it("renders an event's kind as its own eyebrow above the title", () => {
    renderWithWrappers(
      <StopCard
        card={card({ eventKind: "Closing Reception", title: "Georg Baselitz: Back Again" })}
        image={null}
      />
    )

    expect(screen.getByText("Closing Reception")).toBeOnTheScreen()
    expect(screen.getByText("Georg Baselitz: Back Again")).toBeOnTheScreen()
  })

  it("renders no eyebrow when the stop has no event kind", () => {
    renderWithWrappers(<StopCard card={card()} image={null} />)

    expect(screen.queryByText("Closing Reception")).not.toBeOnTheScreen()
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
