import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ContactGalleryButtonTestsQuery } from "__generated__/ContactGalleryButtonTestsQuery.graphql"
import { ContactGalleryButton } from "app/Scenes/Artwork/Components/CommercialButtons/ContactGalleryButton"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ContactGalleryButton", () => {
  it("opens the inquiry modal when the 'contact gallery' button is pressed", async () => {
    renderWithRelay()

    fireEvent.press(screen.getByText("Contact Gallery"))

    await waitFor(() => {
      expect(screen.getByText("What information are you looking for?")).toBeVisible()
    })
  })

  it("tracks an event when the 'contact gallery' button is pressed", async () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
      }),
    })

    fireEvent.press(screen.getByText("Contact Gallery"))

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "tappedContactGallery",
        context_owner_id: "artwork-id",
        context_owner_slug: "artwork-slug",
        context_owner_type: "artwork",
      })
    })
  })
})

const { renderWithRelay } = setupTestWrapper<ContactGalleryButtonTestsQuery>({
  Component: ({ artwork, me }) => <ContactGalleryButton artwork={artwork} me={me} />,
  query: graphql`
    query ContactGalleryButtonTestsQuery @relay_test_operation {
      artwork(id: "artwork-id") @required(action: NONE) {
        ...ContactGalleryButton_artwork
      }
      me @required(action: NONE) {
        ...useSendInquiry_me
        ...MyProfileEditModal_me
      }
    }
  `,
})
