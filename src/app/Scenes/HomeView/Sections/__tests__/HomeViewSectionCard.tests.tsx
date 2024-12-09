import { fireEvent, render, screen } from "@testing-library/react-native"
import { HomeViewSectionCardTestsQuery } from "__generated__/HomeViewSectionCardTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import {
  HomeViewSectionCard,
  HomeViewSectionCardQueryRenderer,
} from "app/Scenes/HomeView/Sections/HomeViewSectionCard"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: jest.fn(),
}))
jest.mock("app/utils/hooks/withSuspense")

describe("HomeViewSectionCard", () => {
  const mockUseFeatureFlag = useFeatureFlag as jest.Mock
  const mockWithSuspense = withSuspense as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const { renderWithRelay } = setupTestWrapper<HomeViewSectionCardTestsQuery>({
    Component: (props) => {
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionCard section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionCardTestsQuery @relay_test_operation {
        homeView @required(action: NONE) {
          section(id: "home-view-section-galleries-near-you") @required(action: NONE) {
            ... on HomeViewSectionCard {
              ...HomeViewSectionCard_section
            }
          }
        }
      }
    `,
  })

  it("renders the section properly", async () => {
    renderWithRelay({
      HomeViewSectionCard: () => ({
        internalID: "home-view-section-a-single-card-section",
        card: {
          title: "Card Title",
          subtitle: "Some additional card text",
          href: "/a-route",
          buttonText: "See more",
          image: {
            imageURL: "https://url.com/image.jpg",
          },
        },
      }),
    })

    expect(screen.getByText("Card Title")).toBeOnTheScreen()
    expect(screen.getByText("Some additional card text")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("See more"))
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedShowMore",
          "context_module": "<mock-value-for-field-"contextModule">",
          "context_screen_owner_type": "home",
          "subject": "See more",
        },
      ]
    `)
    expect(navigate).toHaveBeenCalledWith("/a-route")
  })

  it("renders the infinite discovery section when AREnableInfiniteDiscovery is enabled", () => {
    mockUseFeatureFlag.mockImplementation((key) => {
      if (key === "AREnableInfiniteDiscovery") {
        return true
      }
    })
    mockWithSuspense.mockReturnValue(() => {})

    render(
      <HomeViewSectionCardQueryRenderer
        sectionID="home-view-section-infinite-discovery"
        index={0}
      />
    )

    expect(mockWithSuspense).toHaveBeenCalledOnce()
  })

  it("hides the infinite discovery section when AREnableInfiniteDiscovery is disabled", () => {
    mockUseFeatureFlag.mockImplementation((key) => {
      if (key === "AREnableInfiniteDiscovery") {
        return false
      }
    })
    mockWithSuspense.mockReturnValue(() => {})

    render(
      <HomeViewSectionCardQueryRenderer
        sectionID="home-view-section-infinite-discovery"
        index={0}
      />
    )

    expect(mockWithSuspense).not.toHaveBeenCalled()
  })
})
