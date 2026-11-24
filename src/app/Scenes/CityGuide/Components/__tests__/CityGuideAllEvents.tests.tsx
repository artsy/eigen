import { screen } from "@testing-library/react-native"
import { CityGuideAllEvents } from "app/Scenes/CityGuide/Components/CityGuideAllEvents"
import { BucketResults, emptyBucketResults } from "app/Scenes/CityGuide/utils/bucketCityResults"
import { Fair, Show } from "app/Scenes/CityGuide/utils/types"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const show = (name: string) =>
  ({
    name,
    slug: name.toLowerCase().replace(/ /g, "-"),
    is_followed: false,
    partner: { name: "A Gallery" },
  }) as unknown as Show

const buckets: BucketResults = {
  ...emptyBucketResults,
  fairs: [
    {
      id: "frieze",
      slug: "frieze",
      name: "Frieze New York",
      image: { url: "https://example.com/f.jpg" },
    },
  ] as unknown as Fair[],
  galleries: [show("Gallery Show")],
  museums: [show("Museum Show")],
  closing: [show("Closing Show")],
  opening: [show("Opening Show")],
}

describe(CityGuideAllEvents, () => {
  it("shows a section for every bucket with events", async () => {
    await renderWithWrappers(
      <CityGuideAllEvents buckets={buckets} cityName="New York" citySlug="new-york" />
    )

    expect(screen.getByText("New York City Guide")).toBeOnTheScreen()
    expect(screen.getByText("No saved events")).toBeOnTheScreen()
    expect(screen.getByText("Fairs")).toBeOnTheScreen()
    expect(screen.getByText("Frieze New York")).toBeOnTheScreen()
    expect(screen.getByText("Gallery shows")).toBeOnTheScreen()
    expect(screen.getByText("Museum shows")).toBeOnTheScreen()
    expect(screen.getByText("Closing soon")).toBeOnTheScreen()
    expect(screen.getByText("Opening soon")).toBeOnTheScreen()
  })

  it("leaves out sections whose bucket is empty", async () => {
    await renderWithWrappers(
      <CityGuideAllEvents buckets={emptyBucketResults} cityName="New York" citySlug="new-york" />
    )

    expect(screen.getByText("New York City Guide")).toBeOnTheScreen()
    // The saved section always shows, so people know they can save shows
    expect(screen.getByText("No saved events")).toBeOnTheScreen()
    expect(screen.queryByText("Fairs")).not.toBeOnTheScreen()
    expect(screen.queryByText("Gallery shows")).not.toBeOnTheScreen()
    expect(screen.queryByText("Museum shows")).not.toBeOnTheScreen()
    expect(screen.queryByText("Closing soon")).not.toBeOnTheScreen()
    expect(screen.queryByText("Opening soon")).not.toBeOnTheScreen()
  })

  it("counts saved shows", async () => {
    await renderWithWrappers(
      <CityGuideAllEvents
        buckets={{ ...buckets, saved: [show("Saved Show")] }}
        cityName="New York"
        citySlug="new-york"
      />
    )

    expect(screen.getByText("1 saved event")).toBeOnTheScreen()
  })
})
