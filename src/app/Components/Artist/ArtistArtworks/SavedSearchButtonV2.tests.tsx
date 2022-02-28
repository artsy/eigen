import { fireEvent } from "@testing-library/react-native"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { SavedSearchButtonV2, SavedSearchButtonV2Props } from "./SavedSearchButtonV2"

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
    renderWithWrappersTL(<TestWrapper />)
  })

  it('should call "onPress" handler when it is pressed', () => {
    const onPressMock = jest.fn()
    const { getByText } = renderWithWrappersTL(<TestWrapper onPress={onPressMock} />)

    fireEvent.press(getByText("Create Alert"))

    expect(onPressMock).toBeCalled()
  })

  it("should correctly track event", () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper />)

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
