import { screen } from "@testing-library/react-native"
import { CityGuideEventVideosTestQuery } from "__generated__/CityGuideEventVideosTestQuery.graphql"
import { CityGuideEventVideos } from "app/Scenes/CityGuide/Components/CityGuideEventVideos"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("CityGuideEventVideos", () => {
  const { renderWithRelay } = setupTestWrapper<CityGuideEventVideosTestQuery>({
    Component: CityGuideEventVideos,
    query: graphql`
      query CityGuideEventVideosTestQuery($citySlug: String!, $first: Int!) @relay_test_operation {
        city(slug: $citySlug) {
          ...CityGuideEventVideos_city @arguments(first: $first)
        }
      }
    `,
    variables: { citySlug: "london-united-kingdom", first: 10 },
  })

  const video = (overrides: object = {}) => ({
    internalID: "id-for-video",
    playerUrl: "https://player.vimeo.com/video/76979871",
    width: 352,
    height: 471,
    aspectRatio: 0.75,
    ...overrides,
  })

  const event = (videoValue: object | null, internalID = "id-for-london-art-week") => ({
    internalID,
    video: videoValue,
  })

  const connection = (eventNodes: object[]) => ({
    CityGuideEventsConnection: () => ({ edges: eventNodes.map((node) => ({ node })) }),
  })

  it("renders the static, unpressable section title", async () => {
    renderWithRelay(connection([event(video())]))

    expect(await screen.findByText("Videos")).toBeOnTheScreen()
    expect(screen.queryByTestId("touchable-wrapper")).not.toBeOnTheScreen()
  })

  it("renders a player for the event's video", async () => {
    renderWithRelay(connection([event(video())]))

    expect(await screen.findByTestId("FeatureVideo")).toBeOnTheScreen()
  })

  // The player fills the gutters, so the width is whatever the screen gives it and the ratio
  // is what decides the height. Asserting the relationship rather than the pixels keeps this
  // independent of the test renderer's screen width.
  it("sizes the player from the video's own aspect ratio, keeping it portrait", async () => {
    renderWithRelay(connection([event(video())]))

    const player = await screen.findByTestId("FeatureVideo")

    expect(player.props.height).toBeCloseTo(player.props.width / 0.75)
    expect(player.props.height).toBeGreaterThan(player.props.width)
  })

  it("falls back to the width/height pair when aspectRatio is absent", async () => {
    renderWithRelay(connection([event(video({ aspectRatio: null }))]))

    const player = await screen.findByTestId("FeatureVideo")

    expect(player.props.height).toBeCloseTo(player.props.width / (352 / 471))
  })

  it("renders a player per current event that has a video", async () => {
    renderWithRelay(connection([event(video()), event(video(), "second-event")]))

    expect(await screen.findAllByTestId("FeatureVideo")).toHaveLength(2)
  })

  it("skips an event with no video", async () => {
    renderWithRelay(connection([event(null), event(video(), "second-event")]))

    expect(await screen.findAllByTestId("FeatureVideo")).toHaveLength(1)
  })

  it("renders nothing, heading included, when no event has a video", () => {
    renderWithRelay(connection([event(null)]))

    expect(screen.queryByTestId("city-guide-event-videos")).not.toBeOnTheScreen()
    expect(screen.queryByText("Videos")).not.toBeOnTheScreen()
  })

  /*
    The player only handles Vimeo and YouTube, so a record pointing anywhere else would render
    as an empty heading. It is counted as no video rather than as a video that fails to draw.
  */
  it("ignores a video the player cannot handle", () => {
    renderWithRelay(connection([event(video({ playerUrl: "https://example.com/clip.mp4" }))]))

    expect(screen.queryByTestId("city-guide-event-videos")).not.toBeOnTheScreen()
    expect(screen.queryByTestId("FeatureVideo")).not.toBeOnTheScreen()
  })
})
