import { screen } from "@testing-library/react-native"
import { ActivityRailItemTestQuery } from "__generated__/ActivityRailItemTestQuery.graphql"
import { ActivityRailItem } from "app/Scenes/HomeView/Components/ActivityRailItem"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ActivityRail", () => {
  const { renderWithRelay } = setupTestWrapper<ActivityRailItemTestQuery>({
    Component: ({ me }) => {
      return <ActivityRailItem item={me!.notification!} />
    },
    query: graphql`
      query ActivityRailItemTestQuery @relay_test_operation {
        me {
          notification(id: "example") {
            ...ActivityRailItem_item
          }
        }
      }
    `,
  })

  it("renders a PARTNER_SHOW_OPENED activity item", () => {
    renderWithRelay({
      Me: () => ({
        notification: {
          internalID: "id-1",
          notificationType: "PARTNER_SHOW_OPENED",
          headline: "1 show opened at Pace Gallery",
        },
      }),
    })

    expect(screen.getByText("1 show opened at Pace Gallery")).toBeOnTheScreen()
    expect(screen.getByText("Show •")).toBeOnTheScreen()
  })

  it("renders an ARTWORK_ALERT activity item", () => {
    renderWithRelay({
      Me: () => ({
        notification: {
          internalID: "id-1",
          notificationType: "ARTWORK_ALERT",
          headline: "1 new work by Daniel Arsham",
        },
      }),
    })

    expect(screen.getByText("1 new work by Daniel Arsham")).toBeOnTheScreen()
    expect(screen.getByText("Alert •")).toBeOnTheScreen()
  })

  it("renders an ARTWORK_PUBLISHED artwork alert activity item", () => {
    renderWithRelay({
      Me: () => ({
        notification: {
          internalID: "id-1",
          notificationType: "ARTWORK_PUBLISHED",
          headline: "1 new work by Daniel Arsham",
        },
      }),
    })

    expect(screen.getByText("1 new work by Daniel Arsham")).toBeOnTheScreen()
    expect(screen.getByText("Follow •")).toBeOnTheScreen()
  })

  it("renders an ARTICLE_FEATURED_ARTIST artwork alert activity item", () => {
    renderWithRelay({
      Me: () => ({
        notification: {
          internalID: "id-1",
          notificationType: "ARTICLE_FEATURED_ARTIST",
          headline: "Example Article Title",
          message: "An artist you follow is featured",
        },
      }),
    })

    expect(screen.getByText("Example Article Title")).toBeOnTheScreen()
    expect(screen.getByText("An artist you follow is featured")).toBeOnTheScreen()
    expect(screen.getByText("Editorial •")).toBeOnTheScreen()
  })

  it("renders a PARTNER_OFFER_CREATED artwork alert activity item", () => {
    // Today is Friday, November 01, 2024 11:11:11.000 AM UTC in milliseconds
    Date.now = () => 1730459471000

    renderWithRelay({
      Me: () => ({
        notification: {
          internalID: "id-1",
          notificationType: "PARTNER_OFFER_CREATED",
          headline: "1 new offer for work by Daniel Arsham",
          item: {
            __typename: "PartnerOfferCreatedNotificationItem",
            available: true,
            expiresAt: "2024-11-11T11:11:11+00:00",
          },
        },
      }),
    })

    expect(screen.getByText("Daniel Arsham")).toBeOnTheScreen()
    expect(screen.getByText("Limited-Time Offer")).toBeOnTheScreen()
    expect(screen.getByText("Offer")).toBeOnTheScreen()
    expect(screen.getByText("Expires in", { exact: false })).toBeOnTheScreen()
  })

  it("renders a VIEWING_ROOM_PUBLISHED artwork alert activity item", () => {
    renderWithRelay({
      Me: () => ({
        notification: {
          internalID: "id-1",
          notificationType: "VIEWING_ROOM_PUBLISHED",
          headline: "2 viewing rooms published by Pace Gallery",
        },
      }),
    })

    expect(screen.getByText("2 viewing rooms by Pace Gallery")).toBeOnTheScreen()
    expect(screen.getByText("Viewing Room •")).toBeOnTheScreen()
  })
})
