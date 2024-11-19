import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkItemCTAsTestsQuery } from "__generated__/ArtworkItemCTAsTestsQuery.graphql"
import { ArtworkItemCTAs } from "app/Scenes/Artwork/Components/ArtworkItemCTAs"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("app/utils/experiments/hooks", () => ({
  useExperimentVariant: jest.fn(),
}))

describe("ArtworkItemCTAs", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkItemCTAsTestsQuery>({
    Component: (props) => <ArtworkItemCTAs {...props} artwork={props.artwork!} />,
    query: graphql`
      query ArtworkItemCTAsTestsQuery @relay_test_operation {
        artwork(id: "the-artwork") {
          ...ArtworkItemCTAs_artwork
        }
      }
    `,
  })

  describe("variant-a", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableNewSaveAndFollowOnArtworkCard: true,
      })
      ;(useExperimentVariant as jest.Mock).mockReturnValue({
        enabled: true,
        payload: "variant-a",
        variant: "variant-a",
      })
    })

    it("do not render new Save and Follow icons", () => {
      renderWithRelay({ Artwork: () => artwork }, { showSaveIcon: true })

      expect(screen.queryByTestId("heart-icon-empty")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("heart-icon-filled")).not.toBeOnTheScreen()

      expect(screen.queryByTestId("follow-icon-filled")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("follow-icon-empty")).not.toBeOnTheScreen()
    })
  })

  describe("variant-b", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableNewSaveAndFollowOnArtworkCard: true,
      })
      ;(useExperimentVariant as jest.Mock).mockReturnValue({
        enabled: true,
        payload: "variant-b",
        variant: "variant-b",
      })
    })

    it("render only the new Save icon", () => {
      renderWithRelay(
        {
          Artwork: () => artwork,
        },
        { showSaveIcon: true }
      )

      // do not render Follow icon
      expect(screen.queryByTestId("follow-icon-empty")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("follow-icon-filled")).not.toBeOnTheScreen()

      expect(screen.getByTestId("heart-icon-empty")).toBeOnTheScreen()
      expect(screen.queryByTestId("heart-icon-filled")).not.toBeOnTheScreen()

      fireEvent.press(screen.getByTestId("heart-icon-empty"))

      expect(screen.getByTestId("heart-icon-filled")).toBeOnTheScreen()
      expect(screen.queryByTestId("heart-icon-empty")).not.toBeOnTheScreen()
    })

    it("does not render Save and Follow CTAs if showSaveIcon is false", () => {
      renderWithRelay(
        {
          Artwork: () => artwork,
        },
        { showSaveIcon: false }
      )

      // do not render Save CTA
      expect(screen.queryByTestId("heart-icon-empty")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("heart-icon-filled")).not.toBeOnTheScreen()

      // do not render Follow CTA
      expect(screen.queryByTestId("follow-icon-empty")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("follow-icon-filled")).not.toBeOnTheScreen()
    })

    it("does not render Follow CTA if showFollowIcon is false", () => {
      renderWithRelay({}, { showFollowIcon: false })

      // do not render Follow CTA
      expect(screen.queryByTestId("follow-icon-empty")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("follow-icon-filled")).not.toBeOnTheScreen()
    })
  })

  describe("variant-c", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableNewSaveAndFollowOnArtworkCard: true,
      })
      ;(useExperimentVariant as jest.Mock).mockReturnValue({
        enabled: true,
        payload: "variant-c",
        variant: "variant-c",
      })
    })

    it("renders new Save CTA", () => {
      renderWithRelay(
        {
          Artwork: () => artwork,
        },
        { showSaveIcon: true }
      )

      expect(screen.getByTestId("heart-icon-empty")).toBeOnTheScreen()
      expect(screen.queryByTestId("heart-icon-filled")).not.toBeOnTheScreen()

      fireEvent.press(screen.getByTestId("heart-icon-empty"))

      expect(screen.getByTestId("heart-icon-filled")).toBeOnTheScreen()
      expect(screen.queryByTestId("heart-icon-empty")).not.toBeOnTheScreen()
    })

    it("renders new Follow CTA", () => {
      renderWithRelay(
        {
          Artwork: () => artwork,
        },
        { showSaveIcon: true }
      )

      expect(screen.getByTestId("follow-icon-empty")).toBeOnTheScreen()
      expect(screen.queryByTestId("follow-icon-filled")).not.toBeOnTheScreen()

      fireEvent.press(screen.getByTestId("follow-icon-empty"))

      expect(screen.getByTestId("follow-icon-filled")).toBeOnTheScreen()
      expect(screen.queryByTestId("follow-icon-empty")).not.toBeOnTheScreen()
    })

    it("does not render Save and Follow CTAs if showSaveIcon is false", () => {
      renderWithRelay(
        {
          Artwork: () => artwork,
        },
        { showSaveIcon: false }
      )

      // do not render Save CTA
      expect(screen.queryByTestId("heart-icon-empty")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("heart-icon-filled")).not.toBeOnTheScreen()

      // do not render Follow CTA
      expect(screen.queryByTestId("follow-icon-empty")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("follow-icon-filled")).not.toBeOnTheScreen()
    })
  })
})

const artwork = {
  customArtworkLists: {
    totalCount: 0,
  },
  collectorSignals: {
    auction: {
      lotWatcherCount: 10,
    },
  },
  sale: {
    isAuction: true,
  },
}
