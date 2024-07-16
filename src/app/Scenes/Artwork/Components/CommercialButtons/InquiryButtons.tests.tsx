import { fireEvent, screen } from "@testing-library/react-native"
import { InquiryButtonsTestsQuery } from "__generated__/InquiryButtonsTestsQuery.graphql"
import { InquiryButtons } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryButtons"
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

describe("InquiryButtons", () => {
  beforeEach(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const { renderWithRelay } = setupTestWrapper<InquiryButtonsTestsQuery>({
    Component: ({ artwork }) => <InquiryButtons artwork={artwork!} />,
    query: graphql`
      query InquiryButtonsTestsQuery @relay_test_operation {
        artwork(id: "great-artttt") {
          ...InquiryButtons_artwork
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
