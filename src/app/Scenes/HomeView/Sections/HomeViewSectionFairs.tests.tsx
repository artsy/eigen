import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionFairsTestsQuery } from "__generated__/HomeViewSectionFairsTestsQuery.graphql"
import { HomeViewSectionFairs } from "app/Scenes/HomeView/Sections/HomeViewSectionFairs"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionFairs", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionFairsTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <HomeViewSectionFairs section={props.homeView.section} />
    },
    query: graphql`
      query HomeViewSectionFairsTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-latest-auction-results") {
            ... on HomeViewSectionFairs {
              ...HomeViewSectionFairs_section
            }
          }
        }
      }
    `,
  })

  it("renders nothing when there are no fairs", () => {
    const { toJSON } = renderWithRelay({
      HomeViewComponent: () => ({
        title: "Fairs for You",
        desriptions: "The most exciting fairs in the world",
      }),
      FairConnection: () => ({
        totalCount: 0,
        edges: [],
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders a list of fairs", () => {
    renderWithRelay({
      HomeViewComponent: () => ({
        title: "Fairs for You",
        description: "The most exciting fairs in the world",
      }),
      FairConnection: () => ({
        edges: [
          {
            node: {
              name: "Fair 1",
            },
          },
          {
            node: {
              name: "Fair 2",
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Fairs for You")).toBeOnTheScreen()
    expect(screen.getByText(/Fair 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Fair 2/)).toBeOnTheScreen()
  })

  it("tracks fairs taps properly", () => {
    renderWithRelay({
      HomeViewSectionFairs: () => ({
        internalID: "home-view-section-fairs-for-you",
        component: {
          title: "Fairs for You",
          description: "The most exciting fairs in the world",
        },
        fairsConnection: {
          edges: [
            {
              node: {
                internalID: "fair-1-id",
                slug: "fair-1-slug",
                name: "Fair 1",
              },
            },
            {
              node: {
                internalID: "fair-2-id",
                slug: "fair-2-slug",
                name: "Fair 2",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Fairs for You")).toBeOnTheScreen()
    expect(screen.getByText(/Fair 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Fair 2/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText(/Fair 2/))
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedFairGroup",
            "context_module": "<mock-value-for-field-"contextModule">",
            "context_screen_owner_type": "home",
            "destination_screen_owner_id": "fair-2-id",
            "destination_screen_owner_slug": "fair-2-slug",
            "destination_screen_owner_type": "fair",
            "horizontal_slide_position": 1,
            "module_height": "double",
            "type": "thumbnail",
          },
        ]
      `)

    expect(navigate).toHaveBeenCalledWith("/fair/fair-2-slug")
  })
})
