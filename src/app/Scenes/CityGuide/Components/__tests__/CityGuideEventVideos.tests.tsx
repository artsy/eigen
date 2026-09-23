import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideEventVideosTestQuery } from "__generated__/CityGuideEventVideosTestQuery.graphql"
import { CityGuideEventVideos } from "app/Scenes/CityGuide/Components/CityGuideEventVideos"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("CityGuideEventVideos", () => {
  const { renderWithRelay } = setupTestWrapper<CityGuideEventVideosTestQuery>({
    Component: (props: any) => <CityGuideEventVideos {...props} />,
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
    playerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    ...overrides,
  })

  const attachment = (videoValue: object, internalID = "id-for-video-attachment") => ({
    internalID,
    video: videoValue,
  })

  const cityVideos = (attachments: object[]) => ({
    City: () => ({ cityVideos: attachments }),
  })

  it("renders the section title", () => {
    renderWithRelay(cityVideos([attachment(video())]))

    expect(screen.getByText("Videos")).toBeOnTheScreen()
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
    expect(screen.queryAllByTestId("city-guide-video-card")).toHaveLength(0)
  })

  describe("with a single video", () => {
    it("renders one card and no horizontal rail", () => {
      renderWithRelay(cityVideos([attachment(video())]))

      expect(screen.getAllByTestId("city-guide-video-card")).toHaveLength(1)
    })

    it("shows a YouTube thumbnail before playback", () => {
      renderWithRelay(cityVideos([attachment(video())]))

      const thumbnail = screen.getByTestId("city-guide-video-thumbnail")

      expect(thumbnail.props.source).toEqual({
        uri: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      })
    })

    it("shows the fixed placeholder for a video with no YouTube id", () => {
      renderWithRelay(
        cityVideos([attachment(video({ playerUrl: "https://player.vimeo.com/video/76979871" }))])
      )

      expect(screen.queryByTestId("city-guide-video-thumbnail")).not.toBeOnTheScreen()
      expect(screen.getByTestId("city-guide-video-placeholder")).toBeOnTheScreen()
    })

    it("starts playback in place when the card is tapped", () => {
      renderWithRelay(cityVideos([attachment(video())]))

      expect(screen.queryByTestId("FeatureVideo")).not.toBeOnTheScreen()

      fireEvent.press(screen.getByTestId("city-guide-video-card"))

      expect(screen.getByTestId("FeatureVideo")).toBeOnTheScreen()
    })
  })

  describe("with more than one video", () => {
    it("renders a rail with one card per video", () => {
      renderWithRelay(cityVideos([attachment(video()), attachment(video(), "second-attachment")]))

      expect(screen.getAllByTestId("city-guide-video-card")).toHaveLength(2)
    })

    it("plays only one video at a time", () => {
      renderWithRelay(
        cityVideos([
          attachment(video({ internalID: "video-1" })),
          attachment(video({ internalID: "video-2" }), "second-attachment"),
        ])
      )

      const [firstCard, secondCard] = screen.getAllByTestId("city-guide-video-card")

      fireEvent.press(firstCard)
      expect(screen.getAllByTestId("FeatureVideo")).toHaveLength(1)

      fireEvent.press(secondCard)
      expect(screen.getAllByTestId("FeatureVideo")).toHaveLength(1)
    })
  })
})
