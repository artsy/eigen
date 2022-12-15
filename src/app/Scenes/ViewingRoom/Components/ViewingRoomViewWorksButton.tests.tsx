import { fireEvent, screen } from "@testing-library/react-native"
import { navigate } from "app/navigation/navigate"
import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { tracks, ViewingRoomViewWorksButtonContainer } from "./ViewingRoomViewWorksButton"

jest.unmock("react-relay")

describe("ViewingRoomViewWorksButton", () => {
  const { renderWithRelay } = setupTestWrapperTL({
    Component: (props) => <ViewingRoomViewWorksButtonContainer {...props} />,
    query: graphql`
      query ViewingRoomViewWorksButtonTestsQuery {
        viewingRoom(id: "unused") {
          ...ViewingRoomViewWorksButton_viewingRoom
        }
      }
    `,
  })

  it("navigates to artworks page + calls tracking on button press", () => {
    renderWithRelay({
      ViewingRoom: () => ({
        artworksForCount: { totalCount: 42 },
        slug: "gallery-name-viewing-room-name",
        internalID: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
      }),
    })

    const buttonText = "View works (42)"

    expect(screen.queryByText(buttonText)).toBeTruthy()

    fireEvent.press(screen.getByText(buttonText))

    expect(navigate).toHaveBeenCalledWith("/viewing-room/gallery-name-viewing-room-name/artworks")

    expect(useTracking().trackEvent).toHaveBeenCalledWith(
      tracks.tappedViewWorksButton(
        "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
        "gallery-name-viewing-room-name"
      )
    )
  })
})
