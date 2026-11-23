import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideEventList } from "app/Scenes/CityGuide/Components/CityGuideEventList"
import { Fair, Show } from "app/Scenes/CityGuide/utils/types"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// ShowItemRow reads a Relay fragment; the list only decides which rows to render
jest.mock("app/Components/Lists/ShowItemRow", () => {
  const { Text } = require("react-native")
  return { ShowItemRow: ({ show }: { show: { name: string } }) => <Text>{show.name}</Text> }
})

const shows = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ name: `Show ${i + 1}` })) as unknown as Show[]

const fairs = [{ slug: "frieze", name: "Frieze New York" }] as unknown as Fair[]

describe("CityGuideEventList", () => {
  it("lists the bucket's shows under the header", async () => {
    await renderWithWrappers(
      <CityGuideEventList
        bucket={shows(2)}
        type="galleries"
        cityName="New York"
        header="Gallery shows"
      />
    )

    expect(screen.getByText("Gallery shows")).toBeOnTheScreen()
    expect(screen.getByText("Show 1")).toBeOnTheScreen()
    expect(screen.getByText("Show 2")).toBeOnTheScreen()
  })

  it("renders fairs with the fair row", async () => {
    await renderWithWrappers(
      <CityGuideEventList bucket={fairs as unknown as Show[]} type="fairs" cityName="New York" />
    )

    expect(screen.getByText("Frieze New York")).toBeOnTheScreen()
  })

  describe("in a tab with more shows than fit", () => {
    it("links to the full list", async () => {
      await renderWithWrappers(
        <CityGuideEventList
          bucket={shows(30)}
          type="galleries"
          citySlug="new-york"
          cityName="New York"
          renderedInTab
        />
      )

      await fireEvent.press(screen.getByText("View all 30 shows"))

      expect(navigate).toHaveBeenCalledWith("/city/new-york/galleries")
    })

    it("doesn't link to the full list outside a tab", async () => {
      await renderWithWrappers(
        <CityGuideEventList bucket={shows(30)} type="galleries" cityName="New York" />
      )

      expect(screen.queryByText("View all 30 shows")).not.toBeOnTheScreen()
    })
  })

  describe("when the bucket is empty", () => {
    it("explains how saving works", async () => {
      await renderWithWrappers(<CityGuideEventList bucket={[]} type="saved" cityName="New York" />)

      expect(
        screen.getByText(
          "You haven’t saved any shows in New York. When you save shows, they will show up here."
        )
      ).toBeOnTheScreen()
    })

    it("says there are no fairs", async () => {
      await renderWithWrappers(<CityGuideEventList bucket={[]} type="fairs" cityName="New York" />)

      expect(
        screen.getByText(
          "There are currently no active fairs. Check back later to view fairs in New York."
        )
      ).toBeOnTheScreen()
    })

    it("names the kind of show that's missing", async () => {
      await renderWithWrappers(
        <CityGuideEventList bucket={[]} type="museums" cityName="New York" renderedInTab />
      )

      expect(
        screen.getByText(
          "There are currently no active museums shows. Check back later to view shows in New York."
        )
      ).toBeOnTheScreen()
    })
  })
})
