import { screen } from "@testing-library/react-native"
import { ArtistListItemTestsQuery } from "__generated__/ArtistListItemTestsQuery.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
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
    showMoreIcon?: boolean
    showFollowButton?: boolean
  }> = ({ withFeedback = false, uploadsCount, showMoreIcon = false, showFollowButton = false }) => (
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
              showMoreIcon={showMoreIcon}
              showFollowButton={showFollowButton}
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
    expect(tree.findByType(RouterLink).props.noFeedback).toBe(true)
  })

  it("renders with feedback without throwing an error", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer withFeedback />).root
    resolveMostRecentRelayOperation(mockEnvironment)
    expect(tree.findByType(RouterLink).props.noFeedback).toBe(false)
  })

  it("shows uploaded artworks counts when specified", () => {
    renderWithWrappers(<TestRenderer withFeedback uploadsCount={3} />)
    resolveMostRecentRelayOperation(mockEnvironment)
    expect(screen.getByText("3 artworks uploaded")).toBeTruthy()
  })

  it("shows uploaded artworks counts when no count is specified", () => {
    renderWithWrappers(<TestRenderer withFeedback />)
    resolveMostRecentRelayOperation(mockEnvironment)
    expect(() => screen.getByText("uploaded")).toThrow()
  })

  it("shows the MoreIcon", () => {
    renderWithWrappers(<TestRenderer withFeedback showMoreIcon />)
    resolveMostRecentRelayOperation(mockEnvironment)
    expect(() => screen.getByTestId("more-icon")).toBeTruthy()
  })

  it("shows the FollowButton", () => {
    renderWithWrappers(<TestRenderer withFeedback showFollowButton />)
    resolveMostRecentRelayOperation(mockEnvironment)
    expect(() => screen.getByTestId("follow-artist-button")).toBeTruthy()
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
