import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SavedSearchesListTestsQuery } from "__generated__/SavedSearchesListTestsQuery.graphql"
import { SavedSearchesListPaginationContainer as SavedSearchesList } from "app/Scenes/SavedSearchAlertsList/Components/SavedSearchesList"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Alert } from "react-native"
import { PanGesture } from "react-native-gesture-handler"
import { fireGestureHandler, getByGestureTestId } from "react-native-gesture-handler/jest-utils"
import { graphql } from "react-relay"

jest.spyOn(Alert, "alert")

describe("SavedSearches", () => {
  const { renderWithRelay } = setupTestWrapper<SavedSearchesListTestsQuery>({
    Component: (props) => {
      if (props?.me) {
        return <SavedSearchesList me={props.me} />
      }
      return null
    },
    query: graphql`
      query SavedSearchesListTestsQuery @relay_test_operation {
        me {
          ...SavedSearchesList_me
        }
      }
    `,
  })

  it("renders correctly", async () => {
    await renderWithRelay({
      Me: () => ({
        alertsConnection: {
          edges: [
            {
              node: {
                title: "Banksy",
                subtitle: "Prints",
              },
            },
            {
              node: {
                title: "KAWS",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Banksy")).toBeTruthy()
    expect(screen.getByText("Prints")).toBeTruthy()
    expect(screen.getByText("KAWS")).toBeTruthy()
  })

  it("renders an empty message if there are no saved search alerts", async () => {
    await renderWithRelay({
      Me: () => ({
        alertsConnection: {
          edges: [],
        },
      }),
    })

    expect(screen.getByText("Get notifications when there’s a match.")).toBeTruthy()
  })

  it("renders the default name placeholder if there is no name for saved search alert", async () => {
    await renderWithRelay({
      Me: () => ({
        alertsConnection: {
          edges: [
            {
              node: {
                title: "Banksy",
                subtitle: "Prints",
              },
            },
            {
              node: {
                title: null,
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Banksy")).toBeTruthy()
    expect(screen.getByText("Untitled Alert")).toBeTruthy()
  })

  it("should display Sort By button", async () => {
    await renderWithRelay()

    expect(screen.getByTestId("sortButton")).toBeTruthy()
  })

  it("should display sort options when Sort By button is pressed", async () => {
    await renderWithRelay()

    await fireEvent.press(screen.getByTestId("sortButton"))

    // Wait for the modal to show up
    await flushPromiseQueue()

    expect(screen.getByText("Recently Added")).toBeTruthy()
    expect(screen.getByText("Name (A-Z)")).toBeTruthy()
  })

  it("should pass selected sort option to query variables", async () => {
    const { env } = await renderWithRelay()

    await fireEvent.press(screen.getByTestId("sortButton"))

    // Wait for the modal to show up
    await flushPromiseQueue()

    await fireEvent.press(screen.getByText("Recently Added"))

    await waitFor(() => {
      const operation = env.mock.getMostRecentOperation()
      expect(operation.fragment.variables.sort).toBe("ENABLED_AT_DESC")
    })
  })

  describe("tapping on an alert", () => {
    it("opens the bottom sheet", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableAlertBottomSheet: true })

      await renderWithRelay({
        Me: () => ({
          alertsConnection: {
            edges: [
              {
                node: {
                  internalID: "banksy",
                  title: "Banksy",
                  artworksConnection: {
                    counts: {
                      total: 57,
                    },
                  },
                },
              },
            ],
          },
        }),
      })

      await fireEvent.press(screen.getByText("Banksy"))

      expect(screen.getByText("Edit Alert")).toBeTruthy()
      expect(screen.getByText(/View Artworks/)).toBeTruthy()
      expect(screen.getByText(/57/)).toBeTruthy()
    })
  })

  describe("swipe to delete", () => {
    it("shows delete button and delete alert dialog when clicking on the button", async () => {
      await renderWithRelay({
        Me: () => ({
          alertsConnection: {
            edges: [
              {
                node: {
                  internalID: "banksy",
                  title: "Banksy",
                },
              },
            ],
          },
        }),
      })

      fireGestureHandler<PanGesture>(getByGestureTestId(`pan-alert-banksy`), [
        { translationX: 0 },
        { translationX: -100 },
      ])

      expect(screen.getByTestId(`delete-button-banksy`)).toBeVisible()
      await fireEvent.press(screen.getByTestId(`delete-button-banksy`))

      expect(Alert.alert).toHaveBeenCalled()
    })
  })
})
