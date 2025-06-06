import { fireEvent, screen } from "@testing-library/react-native"
import { ViewingRoomViewWorksButtonTestsQuery } from "__generated__/ViewingRoomViewWorksButtonTestsQuery.graphql"
import {
  tracks,
  ViewingRoomViewWorksButtonContainer,
} from "app/Scenes/ViewingRoom/Components/ViewingRoomViewWorksButton"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

describe("ViewingRoomViewWorksButton", () => {
  const { renderWithRelay } = setupTestWrapper<ViewingRoomViewWorksButtonTestsQuery>({
    Component: ({ viewingRoom }) => (
      <ViewingRoomViewWorksButtonContainer viewingRoom={viewingRoom!} isVisible />
    ),
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

    fireEvent.press(screen.getByText("View works (42)"))

    expect(navigate).toHaveBeenCalledWith("/viewing-room/gallery-name-viewing-room-name/artworks")

    expect(useTracking().trackEvent).toHaveBeenCalledWith(
      tracks.tappedViewWorksButton(
        "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
        "gallery-name-viewing-room-name"
      )
    )
  })
})
