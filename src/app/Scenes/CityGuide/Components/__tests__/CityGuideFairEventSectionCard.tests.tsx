import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideFairEventSectionCard } from "app/Scenes/CityGuide/Components/CityGuideFairEventSectionCard"
import { Fair } from "app/Scenes/CityGuide/utils/types"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const fair = {
  slug: "frieze-new-york-2026",
  name: "Frieze New York 2026",
  exhibition_period: "May 13 – 17",
  image: { url: "https://example.com/fair.jpg" },
  profile: { icon: { url: "https://example.com/logo.png" } },
} as unknown as Fair

describe(CityGuideFairEventSectionCard, () => {
  it("shows the fair's name and dates", async () => {
    await renderWithWrappers(<CityGuideFairEventSectionCard fair={fair} />)

    expect(screen.getByText("Frieze New York 2026")).toBeOnTheScreen()
    expect(screen.getByText("May 13 – 17")).toBeOnTheScreen()
  })

  it("leaves the dates out when the fair has none", async () => {
    await renderWithWrappers(
      <CityGuideFairEventSectionCard fair={{ ...fair, exhibition_period: null } as Fair} />
    )

    expect(screen.getByText("Frieze New York 2026")).toBeOnTheScreen()
    expect(screen.queryByText("May 13 – 17")).not.toBeOnTheScreen()
  })

  it("opens the fair when tapped", async () => {
    await renderWithWrappers(<CityGuideFairEventSectionCard fair={fair} />)

    await fireEvent.press(screen.getByText("Frieze New York 2026"))

    expect(navigate).toHaveBeenCalledWith("/fair/frieze-new-york-2026")
  })
})
