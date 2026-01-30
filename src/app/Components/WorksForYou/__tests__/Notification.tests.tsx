import { screen } from "@testing-library/react-native"
import { NotificationTestsQuery } from "__generated__/NotificationTestsQuery.graphql"
import NotificationFragmentContainer from "app/Components/WorksForYou/Notification"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import "react-native"
import { graphql } from "relay-runtime"

describe("Notification", () => {
  const { renderWithRelay } = setupTestWrapper<NotificationTestsQuery>({
    Component: (props) => (
      <NotificationFragmentContainer
        width={768}
        notification={props.followedArtistsArtworksGroup!}
      />
    ),
    query: graphql`
      query NotificationTestsQuery @relay_test_operation {
        followedArtistsArtworksGroup: node(id: "test-id") {
          ... on FollowedArtistsArtworksGroup {
            ...Notification_notification
          }
        }
      }
    `,
  })
  it("renders notification properly", () => {
    renderWithRelay({
      FollowedArtistsArtworksGroup: () => notification(),
    })

    expect(screen.getByText("Jean-Michel Basquiat")).toBeTruthy()
  })

  it("renders without throwing an error if no avatar image exists", () => {
    const props = notification()
    const convertedProps = {
      ...props,
      image: {
        resized: {
          url: null,
        },
      },
    }

    renderWithRelay({
      FollowedArtistsArtworksGroup: () => convertedProps,
    })
  })
})

const notification = () => {
  return {
    artists: "Jean-Michel Basquiat",
    date: "Mar 16",
    summary: "1 Work Added",
    artworks: { edges: [{ node: { title: "Anti-Product Postcard" } }] },
    status: "UNREAD",
    image: {
      resized: {
        url: "cloudfront.url",
      },
    },
  }
}
