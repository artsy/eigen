import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistHighlightsAndAchievementsTestsQuery } from "__generated__/ArtistHighlightsAndAchievementsTestsQuery.graphql"
import { ArtistHighlightsAndAchievements } from "app/Components/Artist/ArtistAbout/ArtistHighlightsAndAchievements"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistHighlightsAndAchievements", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistHighlightsAndAchievementsTestsQuery>({
    Component: ({ artist }) => <ArtistHighlightsAndAchievements artist={artist!} />,
    query: graphql`
      query ArtistHighlightsAndAchievementsTestsQuery @relay_test_operation {
        artist(id: "artist-id") {
          ...ArtistHighlightsAndAchievements_artist
        }
      }
    `,
  })

  const emptyArtist = {
    internalID: "artist-id",
    slug: "artist-slug",
    insights: [],
    soloShows: { edges: [] },
    fairBooths: { edges: [] },
  }

  const show = {
    name: "Show One",
    city: "City One",
    startYear: "2026",
    partner: { name: "Gallery One" },
  }

  const fairBooth = {
    name: "Gallery One at Fair One",
    exhibitionPeriod: "Jun 1 – 4",
    fair: { name: "Fair One" },
    partner: { name: "Gallery One" },
  }

  it("groups an artist's achievements into four accordions", async () => {
    await renderWithRelay({
      Artist: () => ({
        ...emptyArtist,
        soloShows: { edges: [{ node: show }] },
        fairBooths: { edges: [{ node: fairBooth }] },
        insights: [
          { kind: "GROUP_SHOW", label: "Group show", entities: ["Institution Three"] },
          { kind: "AWARDS", label: "Prize One", entities: [] },
        ],
      }),
    })

    expect(screen.getByText("Highlights and Achievements")).toBeOnTheScreen()
    expect(screen.getByText("Shows")).toBeOnTheScreen()
    expect(screen.getByText("Group exhibitions & institutions")).toBeOnTheScreen()
    expect(screen.getByText("Recent fair presentations")).toBeOnTheScreen()
    expect(screen.getByText("Recognition")).toBeOnTheScreen()
    expect(screen.getByText("See all past shows and fair booths")).toBeOnTheScreen()
  })

  it("lists each accordion's items once it is opened", async () => {
    await renderWithRelay({
      Artist: () => ({
        ...emptyArtist,
        soloShows: { edges: [{ node: show }] },
        fairBooths: { edges: [{ node: fairBooth }] },
        insights: [
          { kind: "SOLO_SHOW", label: "Solo show", entities: ["Institution One"] },
          { kind: "COLLECTED", label: "Collected by", entities: ["Museum One"] },
          { kind: "AWARDS", label: "Awards", entities: ["Prize One"] },
          { kind: "REVIEWED", label: "Reviewed by Publication One", entities: [] },
        ],
      }),
    })

    expect(screen.queryByText("Show One")).not.toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Shows"))
    expect(screen.getByText("Show One")).toBeOnTheScreen()
    expect(screen.getByText("Gallery One, City One · 2026")).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Group exhibitions & institutions"))
    expect(screen.getByText("Institution One")).toBeOnTheScreen()
    expect(screen.getByText("Solo show")).toBeOnTheScreen()
    expect(screen.getByText("Museum One")).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Recent fair presentations"))
    expect(screen.getByText("Fair One")).toBeOnTheScreen()
    expect(screen.getByText("With Gallery One · Jun 1 – 4")).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Recognition"))
    expect(screen.getByText("Prize One")).toBeOnTheScreen()
    expect(screen.getByText("Awards")).toBeOnTheScreen()
    expect(screen.getByText("Reviewed by Publication One")).toBeOnTheScreen()
  })

  it("tracks opening an accordion", async () => {
    await renderWithRelay({
      Artist: () => ({ ...emptyArtist, soloShows: { edges: [{ node: show }] } }),
    })

    await fireEvent.press(screen.getByText("Shows"))

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
[
  {
    "action": "toggledAccordion",
    "context_module": "artistAchievements",
    "context_owner_type": "artistAbout",
    "expand": true,
    "subject": "shows",
  },
]
`)
  })

  it("lists up to six items in an insight accordion", async () => {
    await renderWithRelay({
      Artist: () => ({
        ...emptyArtist,
        insights: [
          {
            kind: "GROUP_SHOW",
            label: "Group show",
            entities: [1, 2, 3, 4, 5, 6, 7].map((number) => `Institution ${number}`),
          },
        ],
      }),
    })

    await fireEvent.press(screen.getByText("Group exhibitions & institutions"))

    expect(screen.getByText("Institution 6")).toBeOnTheScreen()
    expect(screen.queryByText("Institution 7")).not.toBeOnTheScreen()
  })

  it("only shows the accordions the artist has achievements for", async () => {
    await renderWithRelay({
      Artist: () => ({
        ...emptyArtist,
        insights: [{ kind: "REVIEWED", label: "Reviewed by Publication One", entities: [] }],
      }),
    })

    expect(screen.getByText("Recognition")).toBeOnTheScreen()
    expect(screen.queryByText("Shows")).not.toBeOnTheScreen()
    expect(screen.queryByText("Group exhibitions & institutions")).not.toBeOnTheScreen()
    expect(screen.queryByText("Recent fair presentations")).not.toBeOnTheScreen()
  })

  it("renders nothing when the artist has no achievements", async () => {
    await renderWithRelay({ Artist: () => emptyArtist })

    expect(screen.queryByText("Highlights and Achievements")).not.toBeOnTheScreen()
    expect(screen.queryByText("See all past shows and fair booths")).not.toBeOnTheScreen()
  })

  it("links to the artist's CV and tracks the tap", async () => {
    await renderWithRelay({
      Artist: () => ({
        ...emptyArtist,
        insights: [{ kind: "AWARDS", label: "Prize One", entities: [] }],
      }),
    })

    await fireEvent.press(screen.getByText("See all past shows and fair booths"))

    expect(navigate).toHaveBeenCalledWith("/artist/artist-slug/cv")
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
[
  {
    "action": "tappedCV",
    "context_module": "artistAchievements",
    "context_screen_owner_id": "artist-id",
    "context_screen_owner_slug": "artist-slug",
    "context_screen_owner_type": "artistAbout",
  },
]
`)
  })
})
