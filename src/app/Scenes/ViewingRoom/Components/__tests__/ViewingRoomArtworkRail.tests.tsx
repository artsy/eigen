import { fireEvent, screen } from "@testing-library/react-native"
import { ViewingRoomArtworkRailTestsQuery } from "__generated__/ViewingRoomArtworkRailTestsQuery.graphql"
import {
  tracks,
  ViewingRoomArtworkRailContainer,
} from "app/Scenes/ViewingRoom/Components/ViewingRoomArtworkRail"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { postEventToProviders } from "app/utils/track/providers"
import { graphql } from "react-relay"

jest.unmock("react-tracking")

describe("ViewingRoomArtworkRail", () => {
  const { renderWithRelay } = setupTestWrapper<ViewingRoomArtworkRailTestsQuery>({
    Component: ({ viewingRoom }) => <ViewingRoomArtworkRailContainer viewingRoom={viewingRoom!} />,
    query: graphql`
      query ViewingRoomArtworkRailTestsQuery {
        viewingRoom(id: "unused") {
          ...ViewingRoomArtworkRail_viewingRoom
        }
      }
    `,
  })

  it("renders a title for the rail", () => {
    renderWithRelay()

    expect(screen.queryByText("Artworks")).toBeTruthy()
  })

  it("navigates to the artworks screen + calls tracking when title is tapped", () => {
    renderWithRelay({
      ViewingRoom: () => ({
        slug: "gallery-name-viewing-room-name",
        internalID: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
      }),
    })

    fireEvent.press(screen.getByText("Artworks"))

    expect(navigate).toHaveBeenCalledWith("/viewing-room/gallery-name-viewing-room-name/artworks")
    expect(postEventToProviders).toHaveBeenCalledWith(
      tracks.tappedArtworkGroupHeader(
        "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
        "gallery-name-viewing-room-name"
      )
    )
  })

  it("renders artworks", () => {
    renderWithRelay({
      ViewingRoom: () => ({
        artworks: {
          edges: [{ node: { title: "Guernica" } }, { node: { title: "The big wave" } }],
        },
      }),
    })

    expect(screen.queryByText(/Guernica/)).toBeTruthy()
    expect(screen.queryByText(/The big wave/)).toBeTruthy()
  })
})
