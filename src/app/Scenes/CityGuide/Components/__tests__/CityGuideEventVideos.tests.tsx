import { act, fireEvent, screen } from "@testing-library/react-native"
import { CityGuideEventVideosTestQuery } from "__generated__/CityGuideEventVideosTestQuery.graphql"
import { CityGuideEventVideos } from "app/Scenes/CityGuide/Components/CityGuideEventVideos"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("CityGuideEventVideos", () => {
  /** Stands in for the scroll view's measured viewport, which the screen passes down. */
  const PAGE_HEIGHT = 700

  const { renderWithRelay } = setupTestWrapper<CityGuideEventVideosTestQuery>({
    Component: (props: any) => <CityGuideEventVideos {...props} pageHeight={PAGE_HEIGHT} />,
    query: graphql`
      query CityGuideEventVideosTestQuery($citySlug: String!) @relay_test_operation {
        city(slug: $citySlug) {
          ...CityGuideEventVideos_city
        }
      }
    `,
    variables: { citySlug: "london-united-kingdom" },
  })

  const video = (overrides: object = {}) => ({
    internalID: "id-for-video",
    playerUrl: "https://player.vimeo.com/video/76979871",
    width: 352,
    height: 471,
    aspectRatio: 0.75,
    ...overrides,
  })

  const attachment = (videoValue: object, internalID = "id-for-video-attachment") => ({
    internalID,
    video: videoValue,
  })

  const cityVideos = (attachments: object[]) => ({
    City: () => ({ cityVideos: attachments }),
  })

  /**
   * Each page sizes its player from the space the heading leaves behind, which it learns
   * from `onLayout` — nothing lays out in the test renderer, so the pages are handed a
   * height the way the device would.
   */
  const layoutPages = async (height = 800) => {
    const boxes = await screen.findAllByTestId("city-guide-video-box")

    act(() => {
      boxes.forEach((box) => {
        fireEvent(box, "layout", { nativeEvent: { layout: { width: 710, height } } })
      })
    })
  }

  it("renders the static, unpressable section title", async () => {
    renderWithRelay(cityVideos([attachment(video())]))

    expect(await screen.findByText("Videos")).toBeOnTheScreen()
    expect(screen.queryByTestId("touchable-wrapper")).not.toBeOnTheScreen()
  })

  it("renders a player for the attached video", async () => {
    renderWithRelay(cityVideos([attachment(video())]))
    await layoutPages()

    expect(screen.getByTestId("FeatureVideo")).toBeOnTheScreen()
  })

  /*
    The page matches the scroll view's viewport, not the screen: the screen height includes
    the animated header and the bottom tabs, so a page built from it hangs under both and
    can never snap flush.
  */
  it("sizes every page to the viewport it was given", async () => {
    renderWithRelay(cityVideos([attachment(video())]))

    const page = (await screen.findAllByTestId("city-guide-video-page"))[0]
    const { height: screenHeight } = require("react-native").Dimensions.get("window")

    expect(page).toHaveStyle({ height: PAGE_HEIGHT })
    expect(PAGE_HEIGHT).toBeLessThan(screenHeight)
  })

  // The player fills the gutters, so the width is whatever the screen gives it and the ratio
  // is what decides the height. Asserting the relationship rather than the pixels keeps this
  // independent of the test renderer's screen width.
  it("sizes the player from the video's own aspect ratio, keeping it portrait", async () => {
    renderWithRelay(cityVideos([attachment(video())]))
    await layoutPages(2000)

    const player = screen.getByTestId("FeatureVideo")

    expect(player.props.height).toBeCloseTo(player.props.width / 0.75)
    expect(player.props.height).toBeGreaterThan(player.props.width)
  })

  it("falls back to the width/height pair when aspectRatio is absent", async () => {
    renderWithRelay(cityVideos([attachment(video({ aspectRatio: null }))]))
    await layoutPages(2000)

    const player = screen.getByTestId("FeatureVideo")

    expect(player.props.height).toBeCloseTo(player.props.width / (352 / 471))
  })

  // Letterboxed rather than overflowing its page when the clip is taller than the space.
  it("never makes the player taller than its page", async () => {
    renderWithRelay(cityVideos([attachment(video())]))
    await layoutPages(300)

    expect(screen.getByTestId("FeatureVideo").props.height).toBeLessThanOrEqual(300)
  })

  it("renders a player per video attached to the city", async () => {
    renderWithRelay(cityVideos([attachment(video()), attachment(video(), "second-attachment")]))
    await layoutPages()

    expect(screen.getAllByTestId("FeatureVideo")).toHaveLength(2)
  })

  it("renders nothing, heading included, when the city has no videos", () => {
    renderWithRelay(cityVideos([]))

    expect(screen.queryByTestId("city-guide-event-videos")).not.toBeOnTheScreen()
    expect(screen.queryByText("Videos")).not.toBeOnTheScreen()
  })

  /*
    The player only handles Vimeo and YouTube, so a record pointing anywhere else would render
    as an empty heading. It is counted as no video rather than as a video that fails to draw.
  */
  it("ignores a video the player cannot handle", () => {
    renderWithRelay(cityVideos([attachment(video({ playerUrl: "https://example.com/clip.mp4" }))]))

    expect(screen.queryByTestId("city-guide-event-videos")).not.toBeOnTheScreen()
    expect(screen.queryByTestId("FeatureVideo")).not.toBeOnTheScreen()
  })
})
