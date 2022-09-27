import { ActivityItem_Test_Query } from "__generated__/ActivityItem_Test_Query.graphql"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { extractNodes } from "app/utils/extractNodes"
import { DateTime } from "luxon"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ActivityItem } from "./ActivityItem"

jest.unmock("react-relay")

describe("ActivityItem", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<ActivityItem_Test_Query>(
      graphql`
        query ActivityItem_Test_Query {
          notificationsConnection(first: 1) {
            edges {
              node {
                ...ActivityItem_item
              }
            }
          }
        }
      `,
      {}
    )
    const items = extractNodes(data.notificationsConnection)

    return <ActivityItem item={items[0]} />
  }

  it("should the basic info", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Notification: () => notification,
    })
    await flushPromiseQueue()

    expect(getByText("Notification Title")).toBeTruthy()
    expect(getByText("Notification Message")).toBeTruthy()
  })

  it("should render 'x days ago' label", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Notification: () => notification,
    })
    await flushPromiseQueue()

    expect(getByText("1 days ago")).toBeTruthy()
  })

  it("should render 'Today' label", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Notification: () => ({
        ...notification,
        createdAt: DateTime.utc().minus({ hours: 1 }),
      }),
    })
    await flushPromiseQueue()

    expect(getByText("Today")).toBeTruthy()
  })

  it("should render artwork images", async () => {
    const { getAllByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Notification: () => notification,
    })
    await flushPromiseQueue()

    expect(getAllByLabelText("Activity Artwork Image")).toHaveLength(4)
  })

  describe("the remaining artworks count", () => {
    it("should NOT be rendered if there are less or equal to 4", async () => {
      const { queryByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => ({
          ...notification,
          createdAt: DateTime.utc().minus({ hours: 1 }),
        }),
      })
      await flushPromiseQueue()

      const label = queryByLabelText("Remaining artworks count")
      expect(label).toBeNull()
    })

    it("should be rendered if there are more than 4", async () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => ({
          ...notification,
          artworksConnection: {
            ...notification.artworksConnection,
            totalCount: 10,
          },
        }),
      })
      await flushPromiseQueue()

      expect(getByText("+ 6")).toBeTruthy()
    })
  })

  describe("Unread notification indicator", () => {
    it("should NOT be rendered by default", async () => {
      const { queryByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => notification,
      })
      await flushPromiseQueue()

      const indicator = queryByLabelText("Unread notification indicator")
      expect(indicator).toBeNull()
    })

    it("should be rendered when notification is unread", async () => {
      const { getByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => ({
          ...notification,
          isUnread: true,
        }),
      })
      await flushPromiseQueue()

      const indicator = getByLabelText("Unread notification indicator")
      expect(indicator).toBeTruthy()
    })
  })

  describe("Notification type", () => {
    it("should NOT be rendered by default", async () => {
      const { queryByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => notification,
      })
      await flushPromiseQueue()

      const label = queryByLabelText(/Notification type: .+/i)
      expect(label).toBeNull()
    })

    it("should render 'Alert'", async () => {
      const { getByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => ({
          ...notification,
          notificationType: "ARTWORK_ALERT",
        }),
      })
      await flushPromiseQueue()

      const label = getByLabelText("Notification type: Alert")
      expect(label).toBeTruthy()
    })
  })
})

const artworks = [
  {
    node: {
      internalID: "artwork-id-one",
      title: "artwork one",
      image: {
        thumb: {
          src: "artwork-image-one",
          srcSet: "artwork-image-one",
        },
      },
    },
  },
  {
    node: {
      internalID: "artwork-id-two",
      title: "artwork two",
      image: {
        thumb: {
          src: "artwork-image-two",
          srcSet: "artwork-image-two",
        },
      },
    },
  },
  {
    node: {
      internalID: "artwork-id-three",
      title: "artwork three",
      image: {
        thumb: {
          src: "artwork-image-three",
          srcSet: "artwork-image-three",
        },
      },
    },
  },
  {
    node: {
      internalID: "artwork-id-four",
      title: "artwork four",
      image: {
        thumb: {
          src: "artwork-image-four",
          srcSet: "artwork-image-four",
        },
      },
    },
  },
]

const notification = {
  title: "Notification Title",
  message: "Notification Message",
  createdAt: DateTime.utc().minus({ days: 1 }),
  isUnread: false,
  notificationType: "ARTWORK_PUBLISHED",
  artworksConnection: {
    totalCount: 4,
    edges: artworks,
  },
}
