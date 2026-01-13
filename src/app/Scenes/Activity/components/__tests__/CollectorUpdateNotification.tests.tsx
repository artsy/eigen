import { fireEvent, screen } from "@testing-library/react-native"
import { CollectorUpdateNotification_Test_Query } from "__generated__/CollectorUpdateNotification_Test_Query.graphql"
import { CollectorUpdateNotification } from "app/Scenes/Activity/components/CollectorUpdateNotification"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { graphql } from "react-relay"

describe("CollectorUpdateNotification", () => {
  const onPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })
  const { renderWithRelay } = setupTestWrapper<CollectorUpdateNotification_Test_Query>({
    Component: ({ notificationsConnection }) => {
      if (!notificationsConnection.edges?.[0]?.node) {
        return null
      }

      const notification = notificationsConnection.edges[0].node as any
      return (
        <Suspense fallback={null}>
          <CollectorUpdateNotification
            notification={notification}
            item={notification.item}
            onPress={onPress}
          />
        </Suspense>
      )
    },
    query: graphql`
      query CollectorUpdateNotification_Test_Query {
        notificationsConnection(first: 1) @required(action: NONE) {
          edges {
            node {
              ...CollectorUpdateNotification_notification
              item {
                ... on CollectorProfileUpdatePromptNotificationItem {
                  ...CollectorUpdateNotification_item
                  me {
                    ...MyProfileEditModal_me
                  }
                }
              }
            }
          }
        }
      }
    `,
  })

  it("renders collector profile information", async () => {
    renderWithRelay({
      Me: () => ({
        profession: "Blacksmith",
        location: { display: "" },
      }),
      CollectorProfileType: () => ({
        lastUpdatePromptAt: "2021-09-01T00:00:00Z",
      }),
    })

    await screen.findByText("Tell us a little bit more about you.")
  })

  it("renders add artists to collection information", async () => {
    renderWithRelay({
      Me: () => ({
        profession: null,
        myCollectionInfo: { artworksCount: 0 },
        userInterestsConnection: { totalCount: 0 },
      }),
      CollectorProfileType: () => ({
        lastUpdatePromptAt: "2021-09-01T00:00:00Z",
      }),
    })

    await screen.findByText("Show off your collection and make a great impression.")
  })

  it("calls onPress when pressed", async () => {
    renderWithRelay({
      Me: () => ({
        profession: "Blacksmith",
        location: { display: "" },
      }),
      CollectorProfileType: () => ({
        lastUpdatePromptAt: "2021-09-01T00:00:00Z",
      }),
    })

    const title = await screen.findByText("Tell us a little bit more about you.")
    fireEvent.press(title)

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("tracks tappedCompleteYourProfile event when collector profile notification is pressed", async () => {
    renderWithRelay({
      Me: () => ({
        profession: "Blacksmith",
        location: { display: "" },
      }),
      CollectorProfileType: () => ({
        lastUpdatePromptAt: "2021-09-01T00:00:00Z",
      }),
    })

    const title = await screen.findByText("Tell us a little bit more about you.")
    fireEvent.press(title)

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedCompleteYourProfile",
      context_module: "activity",
      context_screen_owner_type: "profile",
    })
  })
})
