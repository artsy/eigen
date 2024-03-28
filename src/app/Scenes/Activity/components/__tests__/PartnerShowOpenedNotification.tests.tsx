import { fireEvent, screen } from "@testing-library/react-native"
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

    await flushPromiseQueue()

    expect(screen.getByText("2 shows published by Institute of Contemporary Art")).toBeTruthy()
    expect(screen.getByText("Show • March 1 – April 1, 2024")).toBeTruthy()
    expect(screen.getByText("Presented by Institute of Contemporary Art")).toBeTruthy()

    expect(screen.getByText("Artwork Title 1")).toBeTruthy()
    expect(screen.getByText("Artwork Title 2")).toBeTruthy()

    // buttons

    expect(screen.getByText("Visit Show")).toBeTruthy()
  })

  describe("'Visit Show CTA", () => {
    it("links to the Viewing Room page", async () => {
      renderWithRelay({
        Me: () => ({
          notification,
        }),
      })

      await flushPromiseQueue()

      const viewAllWorksByLink = screen.getByText("Visit Show")

      fireEvent.press(viewAllWorksByLink)

      await flushPromiseQueue()

      expect(navigate).toHaveBeenCalledWith("/show/damon-zucconi-when-youre-here-youre-familiar")
    })
  })
})

const notification = {
  title: "Institute of Contemporary Art",
  message: "2 shows published",
  headline: "2 shows published by Institute of Contemporary Art",
  publishedAt: "2 days ago",
  isUnread: false,
  notificationType: "PARTNER_SHOW_OPENED",
  objectsCount: 1,
  item: {
    partner: {
      href: "/partner/institute-of-contemporary-art",
      name: "Institute of Contemporary Art",
      profile: {
        internalID: "ica-profile-id",
      },
    },
    showsConnection: {
      edges: {
        node: {
          internalID: "show-one",
          headline: "Damon Zucconi: When You’re Here, You’re Familiar",
          href: "/show/damon-zucconi-when-youre-here-youre-familiar",
          artworkConnection: {
            edges: [
              {
                node: {
                  title: "Artwork Title 1",
                  internalID: "artwork-one",
                  href: "/artwork/damon-zucconi-when-youre-here-youre-familiar",
                  image: {
                    imageURLs: {
                      normalized: "artwork-image-one",
                    },
                    width: 6720,
                    height: 4480,
                  },
                },
              },
              {
                node: {
                  title: "Artwork Title 2",
                  internalID: "artwork-two",
                  href: "/artwork/damon-zucconi-when-youre-here-youre-familiar",
                  image: {
                    imageURLs: {
                      normalized: "artwork-image-two",
                    },
                    width: 6720,
                    height: 4480,
                  },
                },
              },
            ],
          },
          introStatement: "intro statement...",
          image: {
            imageURLs: {
              normalized: "artwork-image-one",
            },
            width: 6720,
            height: 4480,
          },
        },
      },
    },
  },
}
