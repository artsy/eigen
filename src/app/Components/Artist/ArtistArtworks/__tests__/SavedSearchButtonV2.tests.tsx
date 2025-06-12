import { fireEvent } from "@testing-library/react-native"
import {
  SavedSearchButtonV2,
  SavedSearchButtonV2Props,
} from "app/Components/Artist/ArtistArtworks/SavedSearchButtonV2"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SavedSearchButtonV2", () => {
  const TestWrapper = (props: Partial<SavedSearchButtonV2Props>) => {
    return (
      <SavedSearchButtonV2
        onPress={jest.fn}
        artistId="artistId"
        artistSlug="artistSlug"
        {...props}
      />
    )
  }

  it("renders without error", () => {
    renderWithWrappers(<TestWrapper />)
  })

  it('should call "onPress" handler when it is pressed', () => {
    const onPressMock = jest.fn()
    const { getByText } = renderWithWrappers(<TestWrapper onPress={onPressMock} />)

    fireEvent.press(getByText("Create Alert"))

    expect(onPressMock).toBeCalled()
  })

  it("should correctly track event", () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)

    fireEvent.press(getByText("Create Alert"))

    expect(mockTrackEvent).toBeCalledWith({
      action: "tappedCreateAlert",
      context_screen_owner_type: "artist",
      context_screen_owner_id: "artistId",
      context_screen_owner_slug: "artistSlug",
      context_module: "artworkGrid",
    })
  })
})
