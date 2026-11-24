import { act, screen, within } from "@testing-library/react-native"
import { ViewingRoomHeaderTestsQuery } from "__generated__/ViewingRoomHeaderTestsQuery.graphql"
import { ViewingRoomHeaderContainer } from "app/Scenes/ViewingRoom/Components/ViewingRoomHeader"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

// Render FastImage as a host view so its `source` can be asserted on
jest.mock("@d11/react-native-fast-image", () => {
  const React = jest.requireActual("react")
  const { View } = jest.requireActual("react-native")
  const FastImage = (props: any) => React.createElement(View, { testID: "fast-image", ...props })
  FastImage.priority = { low: "low", normal: "normal", high: "high" }
  FastImage.resizeMode = {
    contain: "contain",
    cover: "cover",
    stretch: "stretch",
    center: "center",
  }
  FastImage.preload = jest.fn()
  return { __esModule: true, default: FastImage }
})

jest.mock("app/Components/Countdown/CountdownTimer", () => {
  const React = jest.requireActual("react")
  const { View } = jest.requireActual("react-native")
  return {
    ...jest.requireActual("app/Components/Countdown/CountdownTimer"),
    CountdownTimer: () => React.createElement(View, { testID: "countdown-timer" }),
  }
})

describe("ViewingRoomHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<ViewingRoomHeaderTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ViewingRoomHeaderTestsQuery {
          viewingRoom(id: "unused") {
            ...ViewingRoomHeader_viewingRoom
          }
        }
      `}
      render={renderWithLoadProgress(ViewingRoomHeaderContainer)}
      variables={{}}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })
  it("renders a background image", async () => {
    await renderWithWrappers(<TestRenderer />)

    await act(async () => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ heroImage: { imageURLs: { normalized: "Foo" } } }),
        })

        return result
      })
    })
    expect(within(screen.getByTestId("background-image")).getByTestId("fast-image")).toHaveProp(
      "source",
      expect.objectContaining({ uri: expect.stringContaining("src=Foo&") })
    )
  })
  it("renders a title", async () => {
    await renderWithWrappers(<TestRenderer />)
    await act(async () => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ title: "Foo" }),
        })
        return result
      })
    })
    expect(screen.getByTestId("title")).toHaveTextContent("Foo", { exact: true })
  })

  it("renders a countdown timer for scheduled", async () => {
    await renderWithWrappers(<TestRenderer />)
    await act(async () => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ title: "ok", status: "scheduled" }),
        })
      )
    })
    expect(screen.getAllByTestId("countdown-timer")).toHaveLength(1)
  })

  it("renders a countdown timer for live", async () => {
    await renderWithWrappers(<TestRenderer />)
    await act(async () => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ title: "ok", status: "live" }),
        })
      )
    })
    expect(screen.getAllByTestId("countdown-timer")).toHaveLength(1)
  })

  it("doesn't render a countdown timer for closed", async () => {
    await renderWithWrappers(<TestRenderer />)
    await act(async () => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ title: "ok", status: "closed" }),
        })
      )
    })
    expect(screen.queryByTestId("countdown-timer")).not.toBeOnTheScreen()
  })

  it("renders partner name", async () => {
    await renderWithWrappers(<TestRenderer />)
    await act(async () => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ partner: { name: "Foo" } }),
        })
        return result
      })
    })
    expect(screen.getByTestId("partner-name")).toHaveTextContent("Foo", { exact: true })
  })
  it("renders partner logo", async () => {
    await renderWithWrappers(<TestRenderer />)
    await act(async () => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({
            partner: {
              profile: { icon: { url: "https://example.com/image.jpg" } },
            },
          }),
        })
        return result
      })
    })
    expect(screen.getByTestId("partner-icon")).toHaveProp(
      "source",
      expect.objectContaining({ uri: "https://example.com/image.jpg" })
    )
  })

  it("doesn't render logo (and doesn't crash) if partner profile is null", async () => {
    await renderWithWrappers(<TestRenderer />)
    await act(async () => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({
            partner: {
              profile: null,
            },
          }),
        })
        return result
      })
    })
    expect(screen.queryByTestId("partner-icon")).not.toBeOnTheScreen()
  })
})
