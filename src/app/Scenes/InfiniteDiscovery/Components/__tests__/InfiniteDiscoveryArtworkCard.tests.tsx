import { fireEvent, screen } from "@testing-library/react-native"
import { InfiniteDiscoveryArtworkCardTestQuery } from "__generated__/InfiniteDiscoveryArtworkCardTestQuery.graphql"
import { InfiniteDiscoveryArtworkCard } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryArtworkCard"
import { GlobalStore } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockNavigate = jest.fn()

jest.mock("app/system/navigation/navigate", () => ({
  navigate: (...args: any[]) => mockNavigate(...args),
}))

jest.mock("app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking", () => ({
  useInfiniteDiscoveryTracking: () => ({ artworkImageSwipe: jest.fn() }),
}))

jest.mock("app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryCardSave", () => ({
  useInfiniteDiscoveryCardSave: () => ({
    isSaved: false,
    handleSaveButtonPress: jest.fn(),
    handleDoubleTapSave: jest.fn(),
  }),
}))

describe("InfiniteDiscoveryArtworkCard", () => {
  const { renderWithRelay } = setupTestWrapper<InfiniteDiscoveryArtworkCardTestQuery>({
    Component: ({ artwork }: any) => (
      <InfiniteDiscoveryArtworkCard artwork={artwork} index={0} isTopCard />
    ),
    query: graphql`
      query InfiniteDiscoveryArtworkCardTestQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...InfiniteDiscoveryArtworkCard_artwork
        }
      }
    `,
    preloaded: true,
  })

  beforeEach(() => {
    jest.clearAllMocks()
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(false)
  })

  it("navigates to the artist screen when the artist row is tapped", () => {
    const { mockResolveLastOperation } = renderWithRelay()
    mockResolveLastOperation({ Artist: () => ({ name: "Test Artist" }) })

    fireEvent.press(screen.getByText("Test Artist"))
    expect(mockNavigate).toHaveBeenCalled()
  })

  describe("in onboarding mode", () => {
    beforeEach(() => {
      GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(true)
    })

    it("does not navigate when the artist row is tapped", () => {
      const { mockResolveLastOperation } = renderWithRelay()
      mockResolveLastOperation({ Artist: () => ({ name: "Test Artist" }) })

      fireEvent.press(screen.getByText("Test Artist"))
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
})
