import { fireEvent, screen } from "@testing-library/react-native"
import { ContactGalleryButtonTestsQuery } from "__generated__/ContactGalleryButtonTestsQuery.graphql"
import { ContactGalleryButton } from "app/Scenes/Artwork/Components/CommercialButtons/ContactGalleryButton"
import { InquirySuccessNotification } from "app/Scenes/Artwork/Components/CommercialButtons/InquirySuccessNotification"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { TouchableOpacity } from "react-native"
import { graphql } from "react-relay"

jest.mock("app/Scenes/Artwork/Components/CommercialButtons/InquiryModal", () => {
  return {
    InquiryModal: ({ onMutationSuccessful }: any) => {
      mockSuccessfulMutation.mockImplementation((mockState) => {
        onMutationSuccessful(mockState)
      })
      return null
    },
  }
})

const mockSuccessfulMutation = jest.fn()

describe("ContactGalleryButton", () => {
  beforeEach(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const { renderWithRelay } = setupTestWrapper<ContactGalleryButtonTestsQuery>({
    Component: ({ artwork }) => <ContactGalleryButton artwork={artwork!} />,
    query: graphql`
      query ContactGalleryButtonTestsQuery @relay_test_operation {
        artwork(id: "great-artttt") {
          ...ContactGalleryButton_artwork
        }
      }
    `,
  })

  it("renders the message sent notification and clears the message after 2000 ms", () => {
    renderWithRelay()
    mockSuccessfulMutation(true)

    expect(screen.UNSAFE_getByType(InquirySuccessNotification)).toHaveProp("modalVisible", true)

    jest.advanceTimersByTime(2001)
    jest.runAllTicks()
    expect(screen.UNSAFE_getByType(InquirySuccessNotification)).toHaveProp("modalVisible", false)
  })

  it("navigates to the inbox route when notifcation tapped", () => {
    renderWithRelay()
    mockSuccessfulMutation(true)

    fireEvent.press(screen.UNSAFE_getByType(TouchableOpacity))

    expect(navigate).toHaveBeenCalledWith("inbox")
  })
})
