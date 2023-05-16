import { fireEvent, screen } from "@testing-library/react-native"
import { MyProfileHeaderTestsQuery } from "__generated__/MyProfileHeaderTestsQuery.graphql"
import { MyProfileHeader } from "app/Scenes/MyProfile/MyProfileHeader"
import { navigate } from "app/system/navigation/navigate"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { QueryRenderer, graphql } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

describe("MyProfileHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer: React.FC = () => {
    return (
      <QueryRenderer<MyProfileHeaderTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query MyProfileHeaderTestsQuery @relay_test_operation {
            me {
              ...MyProfileHeader_me
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.me) {
            return <MyProfileHeader me={props.me} />
          }
          return null
        }}
      />
    )
  }

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    act(() => {
      resolveMostRecentRelayOperation(mockEnvironment, mockResolvers)
    })
    return tree
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Header tests
  it("Header Settings onPress navigates to my profile edit", () => {
    getWrapper()
    const profileImage = screen.getByTestId("profile-image")

    expect(profileImage).toBeTruthy()
    fireEvent.press(profileImage)
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith("/my-profile/edit", {
      passProps: { onSuccess: expect.anything() },
    })
  })

  it("Header shows the right text", async () => {
    getWrapper({
      Me: () => ({
        name: "My Name",
        createdAt: new Date().toISOString(),
        bio: "My Bio",
        icon: {
          url: "https://someurll.jpg",
        },
      }),
    })

    const year = new Date().getFullYear()

    expect(screen.queryByText("My Name")).toBeTruthy()
    expect(screen.queryByText(`Member since ${year}`)).toBeTruthy()
    expect(screen.queryByText("My Bio")).toBeTruthy()
  })

  it("renders Collector Profile info", async () => {
    getWrapper({
      Me: () => ({
        name: "Princess",
        createdAt: new Date("12/12/12").toISOString(),
        bio: "Richest Collector! 💰",
        location: {
          display: "Atlantis",
        },
        profession: "Guardian of the Galaxy",
        otherRelevantPositions: "Marvel Universe",
      }),
    })

    expect(screen.queryByText("Guardian of the Galaxy")).toBeTruthy()
    expect(screen.queryByText("Atlantis")).toBeTruthy()
    expect(screen.queryByText("Marvel Universe")).toBeTruthy()
  })
})
