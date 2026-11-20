import { screen } from "@testing-library/react-native"
import { ArtistListItemTestsQuery } from "__generated__/ArtistListItemTestsQuery.graphql"
import { ArtistListItemContainer, formatTombstoneText } from "app/Components/ArtistListItem"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("app/system/navigation/RouterLink", () => {
  const { View } = require("react-native")
  return {
    // Render a host element exposing `noFeedback` so the test can assert on it
    RouterLink: ({ children, noFeedback }: { children: React.ReactNode; noFeedback?: boolean }) => (
      <View testID="router-link" noFeedback={noFeedback}>
        {children}
      </View>
    ),
  }
})

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

  it("renders without feedback without throwing an error", async () => {
    await renderWithWrappers(<TestRenderer />)
    await resolveMostRecentRelayOperation(mockEnvironment)
    expect(screen.getByTestId("router-link")).toHaveProp("noFeedback", true)
  })

  it("renders with feedback without throwing an error", async () => {
    await renderWithWrappers(<TestRenderer withFeedback />)
    await resolveMostRecentRelayOperation(mockEnvironment)
    expect(screen.getByTestId("router-link")).toHaveProp("noFeedback", false)
  })

  it("shows uploaded artworks counts when specified", async () => {
    await renderWithWrappers(<TestRenderer withFeedback uploadsCount={3} />)
    await resolveMostRecentRelayOperation(mockEnvironment)
    expect(screen.getByText("3 artworks uploaded")).toBeTruthy()
  })

  it("shows uploaded artworks counts when no count is specified", async () => {
    await renderWithWrappers(<TestRenderer withFeedback />)
    await resolveMostRecentRelayOperation(mockEnvironment)
    expect(() => screen.getByText("uploaded")).toThrow()
  })

  it("shows the MoreIcon", async () => {
    await renderWithWrappers(<TestRenderer withFeedback showMoreIcon />)
    await resolveMostRecentRelayOperation(mockEnvironment)
    expect(() => screen.getByTestId("more-icon")).toBeTruthy()
  })

  it("shows the FollowButton", async () => {
    await renderWithWrappers(<TestRenderer withFeedback showFollowButton />)
    await resolveMostRecentRelayOperation(mockEnvironment)
    expect(() => screen.getByTestId("follow-artist-button")).toBeTruthy()
  })

  it("labels the FollowButton with the artist's name", () => {
    renderWithWrappers(<TestRenderer showFollowButton />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Artist: () => ({ name: "Test Artist", is_followed: true }),
    })
    // Palette's Button repeats the label on an inner view, so match the button role
    expect(screen.getByRole("button", { name: "Following Test Artist" })).toBeOnTheScreen()
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
