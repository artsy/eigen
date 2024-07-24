import { ContactGalleryButtonTestsQuery } from "__generated__/ContactGalleryButtonTestsQuery.graphql"
import { ContactGalleryButton } from "app/Scenes/Artwork/Components/CommercialButtons/ContactGalleryButton"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ContactGalleryButton", () => {
  beforeEach(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  setupTestWrapper<ContactGalleryButtonTestsQuery>({
    Component: ({ artwork, me }) => <ContactGalleryButton artwork={artwork!} me={me!} />,
    query: graphql`
      query ContactGalleryButtonTestsQuery @relay_test_operation {
        artwork(id: "great-artttt") {
          ...ContactGalleryButton_artwork
        }
        me {
          ...InquiryModal_me
        }
      }
    `,
  })

  test.todo("renders the message sent notification and clears the message after 2000 ms")
  test.todo("navigates to the inbox route when notifcation tapped")
})
