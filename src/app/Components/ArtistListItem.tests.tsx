import { ArtistListItemTestsQuery } from "__generated__/ArtistListItemTestsQuery.graphql"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { Touchable } from "@artsy/palette-mobile"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtistListItemContainer, formatTombstoneText } from "./ArtistListItem"

describe("ArtistListItem", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = ({ withFeedback = false }: { withFeedback?: boolean }) => (
    <QueryRenderer<ArtistListItemTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ArtistListItemTestsQuery @relay_test_operation {
          artist(id: "artist-id") {
            ...ArtistListItem_artist
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artist) {
          return <ArtistListItemContainer artist={props.artist} withFeedback={withFeedback} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders without feedback without throwing an error", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation(mockEnvironment)
    expect(tree.findByType(Touchable).props.noFeedback).toBe(true)
  })

  it("renders with feedback without throwing an error", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer withFeedback />).root
    resolveMostRecentRelayOperation(mockEnvironment)
    expect(tree.findByType(Touchable).props.noFeedback).toBe(false)
  })
})

describe("formatTombstoneText", () => {
  it("formats with birthday and deathday", () => {
    expect(formatTombstoneText("American", "1990", "2014")).toBe("American, 1990-2014")
  })

  it("formats with only birthday and nationality", () => {
    expect(formatTombstoneText("American", "1990", "")).toBe("American, b. 1990")
  })

  it("formats with only nationality", () => {
    expect(formatTombstoneText("American", "", "")).toBe("American")
  })

  it("formats without nationality", () => {
    expect(formatTombstoneText("", "1990", "2014")).toBe("1990-2014")
  })

  it("formats with only birthday", () => {
    expect(formatTombstoneText("", "1990", "")).toBe("b. 1990")
  })
})
