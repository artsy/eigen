import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideSavedEventSection } from "app/Scenes/CityGuide/Components/CityGuideSavedEventSection"
import { Show } from "app/Scenes/CityGuide/utils/types"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const show = (slug: string) => ({ slug, name: slug }) as unknown as Show

describe(CityGuideSavedEventSection, () => {
  it("prompts to save a show when nothing is saved", async () => {
    await renderWithWrappers(<CityGuideSavedEventSection data={[]} citySlug="new-york" />)

    expect(screen.getByText("No saved events")).toBeOnTheScreen()
    expect(screen.getByText("Save a show to find it later")).toBeOnTheScreen()
    expect(screen.queryByRole("button")).not.toBeOnTheScreen()
  })

  it("counts a single saved event", async () => {
    await renderWithWrappers(
      <CityGuideSavedEventSection data={[show("show-1")]} citySlug="new-york" />
    )

    expect(screen.getByText("1 saved event")).toBeOnTheScreen()
    expect(screen.queryByText("No saved events")).not.toBeOnTheScreen()
  })

  it("opens the city's saved events when tapped", async () => {
    await renderWithWrappers(
      <CityGuideSavedEventSection data={[show("show-1"), show("show-2")]} citySlug="new-york" />
    )

    await fireEvent.press(screen.getByRole("button", { name: "2 saved events" }))

    expect(navigate).toHaveBeenCalledWith("/city-save/new-york")
  })
})
