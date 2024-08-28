import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { AlertNotification_Test_Query } from "__generated__/AlertNotification_Test_Query.graphql"
import { AlertNotification } from "app/Scenes/Activity/components/AlertNotification"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

describe("AlertNotification", () => {
  const TestRenderer = () => {
    const data = useLazyLoadQuery<AlertNotification_Test_Query>(
      graphql`
        query AlertNotification_Test_Query {
          me {
            notification(id: "test-id") {
              ...AlertNotification_notification
            }
          }
        }
      `,
      {}
    )

    if (!data.me?.notification) {
      return null
    }

    return <AlertNotification notification={data.me?.notification} />
  }

  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <Suspense fallback={null}>
        <TestRenderer />
      </Suspense>
    ),
  })

  it("renders all elements", async () => {
    renderWithRelay({
      Me: () => ({
        notification,
      }),
    })

    await screen.findByText("Alerts")
    expect(screen.getByText("2 New Works by Banksy")).toBeOnTheScreen()
    expect(screen.getByText("Street Art")).toBeOnTheScreen()
    expect(screen.getByText("Edit")).toBeOnTheScreen()
    expect(screen.getByText("Edit Alert")).toBeOnTheScreen()
    expect(screen.getByText("View all works by Banksy")).toBeOnTheScreen()
  })

  describe("Edit Alert Button in the header", () => {
    it("links to the edit alert screen", async () => {
      renderWithRelay({
        Me: () => ({
          notification,
        }),
      })

      const editAlertButton = await screen.findByTestId("edit-alert-header-link")

      fireEvent.press(editAlertButton)

      await waitFor(() =>
        expect(navigate).toHaveBeenCalledWith("/settings/alerts/internal-alert-id/edit")
      )
    })
  })

  describe("Edit Alert CTA", () => {
    it("links to the edit alert screen", async () => {
      renderWithRelay({
        Me: () => ({
          notification,
        }),
      })

      const editAlertButton = await screen.findByTestId("edit-alert-CTA")

      fireEvent.press(editAlertButton)

      await waitFor(() =>
        expect(navigate).toHaveBeenCalledWith("/settings/alerts/internal-alert-id/edit")
      )
    })
  })

  describe("'View all works by ...' link", () => {
    it("links to alerts target href", async () => {
      renderWithRelay({
        Me: () => ({
          notification,
        }),
      })

      const viewAllWorksByLink = await screen.findByText("View all works by Banksy")

      fireEvent.press(viewAllWorksByLink)

      await waitFor(() => expect(navigate).toHaveBeenCalledWith("/artist/banksy/works-for-sale"))
    })
  })
})

const notification = {
  headline: "2 New Works by Banksy",
  item: {
    __typename: "AlertNotificationItem",
    alert: {
      internalID: "internal-alert-id",
      artists: [
        {
          name: "Banksy",
          slug: "banksy",
        },
      ],
      labels: [
        {
          displayValue: "Banksy",
        },
        {
          displayValue: "Street Art",
        },
      ],
    },
  },
  artworksConnection: {
    edges: [
      {
        node: {
          internalID: "internal-artwork-id",
          slug: "banksy-donuts-strawberry-2157",
          href: "/artwork/banksy-donuts-strawberry-2157",
          title: "Donuts (Strawberry)",
        },
      },
    ],
    totalCount: 2,
  },
  targetHref:
    "/artist/banksy?for_sale=true&search_criteria_id=9f5bf314-b71c-404f-9fbb-edc02d16f2f5&sort=-published_at",
}
