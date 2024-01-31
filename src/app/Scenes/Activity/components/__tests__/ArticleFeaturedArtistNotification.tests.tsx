import { fireEvent, screen } from "@testing-library/react-native"
import { ArticleFeaturedArtistNotification_Test_Query } from "__generated__/ArticleFeaturedArtistNotification_Test_Query.graphql"
import { ArticleFeaturedArtistNotification } from "app/Scenes/Activity/components/ArticleFeaturedArtistNotification"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

describe("ArticleFeaturedArtistNotification", () => {
  const TestRenderer = () => {
    const data = useLazyLoadQuery<ArticleFeaturedArtistNotification_Test_Query>(
      graphql`
        query ArticleFeaturedArtistNotification_Test_Query {
          me {
            notification(id: "test-id") {
              ...ArticleFeaturedArtistNotification_notification
            }
          }
        }
      `,
      {}
    )

    if (!data.me?.notification) {
      return null
    }

    return <ArticleFeaturedArtistNotification notification={data.me?.notification} />
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

    expect(screen.getByText("Editorial")).toBeTruthy()
    expect(screen.getByText("An artist you follow is featured")).toBeTruthy()
    expect(screen.getByText("Following")).toBeTruthy()
  })

  describe("Artist section", () => {
    it("opens Artist page", async () => {
      renderWithRelay({
        Me: () => ({
          notification,
        }),
      })

      await flushPromiseQueue()

      const artistName = screen.getByText("lee eun")

      fireEvent.press(artistName)

      await flushPromiseQueue()

      expect(navigate).toHaveBeenCalledWith("/artist/lee-eun-1")
    })
  })

  describe("Article secion", () => {
    it("opens article from Article card", async () => {
      renderWithRelay({
        Me: () => ({
          notification,
        }),
      })

      await flushPromiseQueue()

      const editorialTitle = screen.getByTestId("article-card")

      fireEvent.press(editorialTitle)

      await flushPromiseQueue()

      expect(navigate).toHaveBeenCalledWith(
        "/article/artsy-editorial-10-artists-discover-foundations"
      )
    })

    it("opens article by pressing the Read Article CTA", async () => {
      renderWithRelay({ Me: () => ({ notification }) })

      await flushPromiseQueue()

      const readArticleCTA = screen.getByText("Read Article")

      fireEvent.press(readArticleCTA)

      await flushPromiseQueue()

      expect(navigate).toHaveBeenCalledWith(
        "/article/artsy-editorial-10-artists-discover-foundations"
      )
    })
  })
})

const notification = {
  message: "An artist you follow is featured",
  item: {
    __typename: "ArticleFeaturedArtistNotificationItem",
    article: {
      byline: "Artsy Editorial",
      href: "/article/artsy-editorial-10-artists-discover-foundations",
      internalID: "65a9a8287366270021ad43eb",
      publishedAt: "2024-01-23T15:00:00+01:00",
      slug: "artsy-editorial-10-artists-discover-foundations",
      thumbnailImage: {
        url: "https://artsy-media-uploads.s3.amazonaws.com/V2strykhijIZPIi_UBBy3Q%2FThumbnail+1+%28MAG%29.png",
        thumbnailTitle: "10 Artists to Discover in Foundations",
        vertical: "Art",
      },
    },
    artistsConnection: {
      edges: [
        {
          node: {
            href: "/artist/lee-eun-1",
            id: "QXJ0aXN0OjYxODRiMjQ4NmExZmJmMDAwZDBkNjU2OQ==",
            internalID: "6184b2486a1fbf000d0d6569",
            isFollowed: true,
            name: "lee eun",
            slug: "lee-eun-1",
          },
        },
      ],
    },
  },
}
