import { screen } from "@testing-library/react-native"
import { AlertsListTestsQuery } from "__generated__/AlertsListTestsQuery.graphql"
import { AlertsListPaginationContainer } from "app/Scenes/Favorites/Components/AlertsList"
import { FavoritesContextStore } from "app/Scenes/Favorites/FavoritesContextStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("AlertsList", () => {
  const { renderWithRelay } = setupTestWrapper<AlertsListTestsQuery>({
    Component: ({ me }) => {
      return (
        <FavoritesContextStore.Provider>
          <AlertsListPaginationContainer me={me} />
        </FavoritesContextStore.Provider>
      )
    },
    query: graphql`
      query AlertsListTestsQuery @relay_test_operation {
        me @required(action: NONE) {
          ...AlertsList_me
        }
      }
    `,
  })

  it("renders empty state when the user has no saved searches", () => {
    renderWithRelay({
      Me: () => ({
        alertsConnection: {
          edges: [],
        },
      }),
    })

    // Check for elements from the EmptyMessage component
    expect(screen.getByText("Hunting for a")).toBeTruthy()
    expect(screen.getByText("particular artwork?")).toBeTruthy()
    expect(screen.getByText("Find your artist")).toBeTruthy()
    expect(screen.getByText("Filter")).toBeTruthy()
    expect(screen.getByText("Create alert")).toBeTruthy()
    expect(screen.getByText("Get a match")).toBeTruthy()
    expect(screen.getByText("Explore Artists")).toBeTruthy()
  })

  it("renders a list of alerts", () => {
    renderWithRelay({
      Me: () => ({
        alertsConnection: {
          edges: [
            {
              node: {
                internalID: "alert-1",
                title: "Alert Title 1",
                subtitle: "Alert Subtitle 1",
                artworksConnection: {
                  counts: {
                    total: 5,
                  },
                  edges: [
                    {
                      node: {
                        image: {
                          resized: {
                            url: "image-url-1",
                          },
                          blurhash: "blurhash-1",
                        },
                      },
                    },
                  ],
                },
              },
            },
            {
              node: {
                internalID: "alert-2",
                title: "Alert Title 2",
                subtitle: "Alert Subtitle 2",
                artworksConnection: {
                  counts: {
                    total: 10,
                  },
                  edges: [
                    {
                      node: {
                        image: {
                          resized: {
                            url: "image-url-2",
                          },
                          blurhash: "blurhash-2",
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Alert Title 1")).toBeTruthy()
    expect(screen.getByText("Alert Subtitle 1")).toBeTruthy()
    expect(screen.getByText("Alert Title 2")).toBeTruthy()
    expect(screen.getByText("Alert Subtitle 2")).toBeTruthy()
  })
})
