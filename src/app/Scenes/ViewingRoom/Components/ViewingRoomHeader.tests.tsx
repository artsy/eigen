import { ViewingRoomHeaderTestsQuery } from "__generated__/ViewingRoomHeaderTestsQuery.graphql"
import { CountdownTimer } from "app/Components/Countdown/CountdownTimer"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { graphql, QueryRenderer } from "react-relay"
import { PartnerIconImage, ViewingRoomHeaderContainer } from "./ViewingRoomHeader"

describe("ViewingRoomHeader", () => {
  const TestRenderer = () => (
    <QueryRenderer<ViewingRoomHeaderTestsQuery>
      environment={getRelayEnvironment()}
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

  it("renders a background image", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      ViewingRoom: () => ({ heroImage: { imageURLs: { normalized: "Foo" } } }),
    })
    expect(tree.root.findByProps({ testID: "background-image" }).props.imageURL).toBe("Foo")
  })
  it("renders a title", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      ViewingRoom: () => ({ title: "Foo" }),
    })
    expect(extractText(tree.root.findByProps({ testID: "title" }))).toBe("Foo")
  })

  it("renders a countdown timer for scheduled", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      ViewingRoom: () => ({ title: "ok", status: "scheduled" }),
    })
    expect(tree.root.findAllByType(CountdownTimer)).toHaveLength(1)
  })

  it("renders a countdown timer for live", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      ViewingRoom: () => ({ title: "ok", status: "live" }),
    })

    expect(tree.root.findAllByType(CountdownTimer)).toHaveLength(1)
  })

  it("doesn't render a countdown timer for closed", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      ViewingRoom: () => ({ title: "ok", status: "closed" }),
    })

    expect(tree.root.findAllByType(CountdownTimer)).toHaveLength(0)
  })

  it("renders partner name", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      ViewingRoom: () => ({ partner: { name: "Foo" } }),
    })

    expect(extractText(tree.root.findByProps({ testID: "partner-name" }))).toBe("Foo")
  })
  it("renders partner logo", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      ViewingRoom: () => ({
        partner: {
          profile: { icon: { url: "https://example.com/image.jpg" } },
        },
      }),
    })
    expect(tree.root.findByProps({ testID: "partner-icon" }).props.source.uri).toBe(
      "https://example.com/image.jpg"
    )
  })

  it("doesn't render logo (and doesn't crash) if partner profile is null", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      ViewingRoom: () => ({
        partner: {
          profile: null,
        },
      }),
    })
    expect(tree.root.findAllByType(PartnerIconImage)).toHaveLength(0)
  })
})
