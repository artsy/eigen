import { InquiryButtonsTestsQuery } from "__generated__/InquiryButtonsTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { InquiryButtonsFragmentContainer } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryButtons"
import { InquirySuccessNotification } from "app/Scenes/Artwork/Components/CommercialButtons/InquirySuccessNotification"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"

jest.mock("app/Scenes/Artwork/Components/CommercialButtons/InquiryModal", () => {
  return {
    InquiryModalFragmentContainer: ({ onMutationSuccessful }: any) => {
      mockSuccessfulMutation.mockImplementation((mockState) => {
        onMutationSuccessful(mockState)
      })
      return null
    },
  }
})

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.clearAllMocks()
})

const mockSuccessfulMutation = jest.fn()

const TestRenderer = () => {
  return (
    <QueryRenderer<InquiryButtonsTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query InquiryButtonsTestsQuery($id: String!) @relay_test_operation {
          artwork(id: $id) {
            ...InquiryButtons_artwork
          }
        }
      `}
      variables={{ id: "great-artttt" }}
      render={({ props, error }) => {
        if (Boolean(props?.artwork!)) {
          return <InquiryButtonsFragmentContainer artwork={props!.artwork!} />
        } else if (Boolean(error)) {
          console.error(error)
        }
      }}
    />
  )
}

const getWrapper = () => {
  const tree = renderWithWrappersLEGACY(<TestRenderer />)
  resolveMostRecentRelayOperation()
  return tree
}

describe("Inquiry message notification", () => {
  it("renders the message sent notifcation", () => {
    const wrapper = getWrapper()
    mockSuccessfulMutation(true)
    expect(wrapper.root.findByType(InquirySuccessNotification).props.modalVisible).toBe(true)
  })

  it("clears the message sent notifcation after 2000 ms", () => {
    const wrapper = getWrapper()
    mockSuccessfulMutation(true)
    expect(wrapper.root.findByType(InquirySuccessNotification).props.modalVisible).toBe(true)
    jest.advanceTimersByTime(2001)
    jest.runAllTicks()
    expect(wrapper.root.findByType(InquirySuccessNotification).props.modalVisible).toBe(false)
  })

  it("navigates to the inbox route when notifcation tapped", () => {
    const wrapper = getWrapper()
    mockSuccessfulMutation(true)
    wrapper.root.findByType(TouchableOpacity).props.onPress()
    expect(navigate).toHaveBeenCalledWith("inbox")
  })
})
