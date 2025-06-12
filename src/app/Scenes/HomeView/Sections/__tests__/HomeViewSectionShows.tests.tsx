import { act, fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { HomeViewSectionShowsTestsQuery } from "__generated__/HomeViewSectionShowsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionShows } from "app/Scenes/HomeView/Sections/HomeViewSectionShows"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-native-community/geolocation", () => ({
  setRNConfiguration: jest.fn(),
  getCurrentPosition: jest.fn((success, _) => {
    success({ coords: { latitude: 1, longitude: 2 } })
  }),
}))

describe("HomeViewSectionShows", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionShowsTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionShows section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionShowsTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-shows") {
            ... on HomeViewSectionShows {
              ...HomeViewSectionShows_section
            }
          }
        }
      }
    `,
  })

  it("renders the section properly", async () => {
    const { mockResolveLastOperation } = renderWithRelay({
      HomeViewComponent: () => ({
        title: "Shows for You",
      }),
    })

    act(() => {
      mockResolveLastOperation({
        ShowConnection: () => ({
          edges: [
            {
              node: {
                name: "show 1",
              },
            },
            {
              node: {
                name: "show 2",
              },
            },
          ],
        }),
      })
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("show-rail-placeholder"))

    expect(screen.getByText("Shows for You")).toBeOnTheScreen()
    expect(screen.getByText("show 1")).toBeOnTheScreen()
    expect(screen.getByText("show 2")).toBeOnTheScreen()
  })

  it("tracks shows taps properly", async () => {
    const { mockResolveLastOperation } = renderWithRelay({
      HomeViewSectionShows: () => ({
        internalID: "home-view-section-shows-for-you",
        component: {
          title: "Shows for You",
        },
      }),
    })

    act(() => {
      mockResolveLastOperation({
        ShowConnection: () => ({
          edges: [
            {
              node: {
                internalID: "show-1-id",
                slug: "show-1-slug",
                name: "show 1",
                href: "/show-1-href",
              },
            },
            {
              node: {
                internalID: "show-2-id",
                slug: "show-2-slug",
                name: "show 2",
                href: "/show-2-href",
              },
            },
          ],
        }),
      })
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("show-rail-placeholder"))

    fireEvent.press(screen.getByText("show 2"))
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedShowGroup",
            "context_module": "<mock-value-for-field-"contextModule">",
            "context_screen_owner_type": "home",
            "destination_screen_owner_id": "show-2-id",
            "destination_screen_owner_slug": "show-2-slug",
            "destination_screen_owner_type": "show",
            "horizontal_slide_position": 1,
            "type": "thumbnail",
          },
        ]
      `)

    expect(navigate).toHaveBeenCalledWith("/show-2-href")
  })
})
