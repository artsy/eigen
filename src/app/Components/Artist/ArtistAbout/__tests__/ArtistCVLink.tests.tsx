import { ContextModule } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistCVLink } from "app/Components/Artist/ArtistAbout/ArtistCVLink"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ArtistCVLink", () => {
  it("opens the artist's CV and tracks the tap", async () => {
    await renderWithWrappers(
      <ArtistCVLink
        artistID="artist-id"
        artistSlug="artist-slug"
        contextModule={ContextModule.about}
      >
        View CV
      </ArtistCVLink>
    )

    await fireEvent.press(screen.getByText("View CV"))

    expect(navigate).toHaveBeenCalledWith("/artist/artist-slug/cv")
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
[
  {
    "action": "tappedCV",
    "context_module": "about",
    "context_screen_owner_id": "artist-id",
    "context_screen_owner_slug": "artist-slug",
    "context_screen_owner_type": "artistAbout",
  },
]
`)
  })
})
