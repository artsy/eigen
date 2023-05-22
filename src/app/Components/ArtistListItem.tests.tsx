import { Touchable } from "@artsy/palette-mobile"
import { ArtistListItemTestsQuery } from "__generated__/ArtistListItemTestsQuery.graphql"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtistListItemContainer, formatTombstoneText } from "./ArtistListItem"

describe("ArtistListItem", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer: React.FC<{
    withFeedback?: boolean
    uploadsCount?: number | null
  }> = ({ withFeedback = false, uploadsCount }) => (
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
          return (
            <ArtistListItemContainer
              artist={props.artist}
              withFeedback={withFeedback}
              uploadsCount={uploadsCount}
            />
          )
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

  it("shows uploaded artworks counts when specified", () => {
    const { getByText } = renderWithWrappers(<TestRenderer withFeedback uploadsCount={3} />)
    resolveMostRecentRelayOperation(mockEnvironment)
    expect(getByText("3 artworks uploaded")).toBeTruthy()
  })

  it("shows uploaded artworks counts when no count is specified", () => {
    const { getByText } = renderWithWrappers(<TestRenderer withFeedback />)
    resolveMostRecentRelayOperation(mockEnvironment)
    expect(() => getByText("uploaded")).toThrow()
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
