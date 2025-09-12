import { act, fireEvent, screen } from "@testing-library/react-native"
import { ViewingRoomPublishedNotification_Test_Query } from "__generated__/ViewingRoomPublishedNotification_Test_Query.graphql"
import { ViewingRoomPublishedNotification } from "app/Scenes/Activity/components/ViewingRoomPublishedNotification"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

describe("ViewingRoomPublishedNotification", () => {
  const TestRenderer = () => {
    const data = useLazyLoadQuery<ViewingRoomPublishedNotification_Test_Query>(
      graphql`
        query ViewingRoomPublishedNotification_Test_Query {
          me {
            notification(id: "test-id") {
              ...ViewingRoomPublishedNotification_notification
            }
          }
        }
      `,
      {}
    )

    if (!data.me?.notification) {
      return null
    }

    return <ViewingRoomPublishedNotification notification={data.me?.notification} />
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

    expect(screen.getByText("Viewing Room")).toBeTruthy()
    expect(screen.getByText("1 viewing room published by Arton Contemporary")).toBeTruthy()
    expect(screen.getByText("Following")).toBeTruthy()
    expect(screen.getByText("View Works")).toBeTruthy()
  })

  describe("'View Works CTA", () => {
    it("links to the Viewing Room page", async () => {
      renderWithRelay({
        Me: () => ({
          notification,
        }),
      })

      await act(async () => {
        await flushPromiseQueue()
      })

      const viewAllWorksByLink = screen.getByText("View Works")

      fireEvent.press(viewAllWorksByLink)

      await act(async () => {
        await flushPromiseQueue()
      })

      expect(navigate).toHaveBeenCalledWith('/viewing-room/<mock-value-for-field-"slug">')
    })
  })
})

const notification = {
  headline: "1 viewing room published by Arton Contemporary",
  item: {
    __typename: "ViewingRoomPublishedNotificationItem",
    partner: {
      name: "Arton Contemporary",
      href: "/partner/arton-contemporary",
      profile: {
        id: "UHJvZmlsZTo1YmZjOGQ5ZWQ2Y2FmODQxNjQwMDQxNzM",
        internalID: "5bfc8d9ed6caf84164004173",
        isFollowed: true,
      },
    },
    viewingRoomsConnection: {
      slug: "arton-contemporary-damien-hirst-dreaming-in-color",
    },
  },
}
