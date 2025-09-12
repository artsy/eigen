import { act, fireEvent, screen } from "@testing-library/react-native"
import { ArtworkPublishedNotification_Test_Query } from "__generated__/ArtworkPublishedNotification_Test_Query.graphql"
import { ArtworkPublishedNotification } from "app/Scenes/Activity/components/ArtworkPublishedNotification"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

describe("ArtworkPublishedNotification", () => {
  const TestRenderer = () => {
    const data = useLazyLoadQuery<ArtworkPublishedNotification_Test_Query>(
      graphql`
        query ArtworkPublishedNotification_Test_Query {
          me {
            notification(id: "test-id") {
              ...ArtworkPublishedNotification_notification
            }
          }
        }
      `,
      {}
    )

    if (!data.me?.notification) {
      return null
    }

    return <ArtworkPublishedNotification notification={data.me?.notification} />
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

    await act(async () => {
      await flushPromiseQueue()
    })

    expect(screen.getByText("Follows")).toBeTruthy()
    expect(screen.getByText("1 New Work by Tracey Emin")).toBeTruthy()
    expect(screen.getByText("Following")).toBeTruthy()
    expect(screen.getByText("View all works by Tracey Emin")).toBeTruthy()
  })

  describe("'View all works by ...' link", () => {
    it("links to follows target href", async () => {
      renderWithRelay({
        Me: () => ({
          notification,
        }),
      })

      await act(async () => {
        await flushPromiseQueue()
      })

      const viewAllWorksByLink = screen.getByText("View all works by Tracey Emin")

      fireEvent.press(viewAllWorksByLink)

      await act(async () => {
        await flushPromiseQueue()
      })

      expect(navigate).toHaveBeenCalledWith("/artist/tracey-emin/works-for-sale")
    })
  })
})

const notification = {
  headline: "1 New Work by Tracey Emin",
  item: {
    __typename: "ArtworkPublishedNotificationItem",
    artists: [
      {
        isFollowed: true,
        name: "Tracey Emin",
        slug: "tracey-emin",
      },
    ],
  },
  artworksConnection: {
    edges: [
      {
        node: {
          internalID: "internal-artwork-id",
          slug: "tracey-emin-move-me-4",
          href: "/artwork/tracey-emin-move-me-4",
          title: "Move me",
        },
      },
    ],
    totalCount: 1,
  },
  targetHref: "/artwork/tracey-emin-move-me-4",
}
