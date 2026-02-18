import { act, fireEvent, screen } from "@testing-library/react-native"
import { PartnerShowOpenedNotification_Test_Query } from "__generated__/PartnerShowOpenedNotification_Test_Query.graphql"
import { PartnerShowOpenedNotification } from "app/Scenes/Activity/components/PartnerShowOpenedNotification"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

describe("PartnerShowOpenedNotification", () => {
  const TestRenderer = () => {
    const data = useLazyLoadQuery<PartnerShowOpenedNotification_Test_Query>(
      graphql`
        query PartnerShowOpenedNotification_Test_Query {
          me {
            notification(id: "test-id") {
              ...PartnerShowOpenedNotification_notification
            }
          }
        }
      `,
      {}
    )

    if (!data.me?.notification) {
      return null
    }

    return <PartnerShowOpenedNotification notification={data.me?.notification} />
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

    expect(screen.getByText("Shows")).toBeTruthy()

    expect(screen.getByText("1 show opened at THEO")).toBeTruthy()
    expect(screen.getByText("THEO  at ART OnO")).toBeTruthy()
    expect(screen.getByText("April 19 – 21, 2024")).toBeTruthy()
  })

  describe("'Visit Show CTA", () => {
    it("links to the Viewing Room page", async () => {
      renderWithRelay({
        Me: () => ({
          notification,
        }),
      })

      await act(async () => {
        await flushPromiseQueue()
      })

      const viewAllWorksByLink = screen.getByTestId("show-item-visit-show-link")

      fireEvent.press(viewAllWorksByLink)

      await act(async () => {
        await flushPromiseQueue()
      })

      expect(navigate).toHaveBeenCalledWith("/show/theo-theo-at-art-ono?entity=fair-booth")
    })
  })
})

const notification = {
  notificationType: "PARTNER_SHOW_OPENED",
  targetHref: "/show/theo-theo-at-art-ono",
  artworksConnection: {
    edges: [],
    totalCount: 0,
  },
  headline: "1 show opened at THEO ",
  item: {
    __typename: "ShowOpenedNotificationItem",
    partner: {
      href: "/partner/theo",
      name: "THEO",
      profile: {
        internalID: "profile-id",
      },
    },
    showsConnection: {
      edges: [
        {
          node: {
            location: {
              city: null,
            },
            exhibitionPeriod: "April 19 – 21, 2024",
            startAt: "2024-04-19T14:00:00+02:00",
            endAt: "2024-04-21T14:00:00+02:00",
            name: "THEO  at ART OnO",
            description: "show description",
            slug: "theo-theo-at-art-ono",
            href: "/show/theo-theo-at-art-ono",
          },
        },
      ],
    },
  },
  publishedAt: "Today",
  offerArtworksConnection: {
    edges: [],
  },
}
