import { ViewingRoomHeaderTestsQuery } from "__generated__/ViewingRoomHeaderTestsQuery.graphql"
import { CountdownTimer } from "app/Components/Countdown/CountdownTimer"
import {
  PartnerIconImage,
  ViewingRoomHeaderContainer,
} from "app/Scenes/ViewingRoom/Components/ViewingRoomHeader"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

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
  it("renders a background image", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ heroImage: { imageURLs: { normalized: "Foo" } } }),
      })

      return result
    })
    expect(tree.root.findByProps({ testID: "background-image" }).props.src).toBe("Foo")
  })
  it("renders a title", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ title: "Foo" }),
      })
      return result
    })
    expect(extractText(tree.root.findByProps({ testID: "title" }))).toBe("Foo")
  })

  it("renders a countdown timer for scheduled", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ title: "ok", status: "scheduled" }),
      })
    )
    expect(tree.root.findAllByType(CountdownTimer)).toHaveLength(1)
  })

  it("renders a countdown timer for live", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ title: "ok", status: "live" }),
      })
    )
    expect(tree.root.findAllByType(CountdownTimer)).toHaveLength(1)
  })

  it("doesn't render a countdown timer for closed", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ title: "ok", status: "closed" }),
      })
    )
    expect(tree.root.findAllByType(CountdownTimer)).toHaveLength(0)
  })

  it("renders partner name", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ partner: { name: "Foo" } }),
      })
      return result
    })
    expect(extractText(tree.root.findByProps({ testID: "partner-name" }))).toBe("Foo")
  })
  it("renders partner logo", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
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
    expect(tree.root.findByProps({ testID: "partner-icon" }).props.source.uri).toBe(
      "https://example.com/image.jpg"
    )
  })

  it("doesn't render logo (and doesn't crash) if partner profile is null", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
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
    expect(tree.root.findAllByType(PartnerIconImage)).toHaveLength(0)
  })
})
