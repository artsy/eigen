import { ProgressBar } from "@artsy/palette-mobile"
import {
  ArtworkAuctionProgressBar,
  ArtworkAuctionProgressBarProps,
} from "app/Components/Bidding/Components/ArtworkAuctionProgressBar"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ArtworkAuctionProgressBar", () => {
  describe("when the lot hasn't been extended and isn't within the extended bidding period", () => {
    it("doesn't show a progress bar", () => {
      const props: ArtworkAuctionProgressBarProps = {
        extendedBiddingPeriodMinutes: 2,
        extendedBiddingIntervalMinutes: 2,
        startAt: new Date(Date.now()).toISOString(),
        biddingEndAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        hasBeenExtended: false,
      }

      const wrapper = renderWithWrappers(<ArtworkAuctionProgressBar {...props} />)

      expect(wrapper.UNSAFE_queryAllByType(ProgressBar).length).toBe(0)
    })
  })

  describe("when the lot has been extended", () => {
    it("shows a progress bar", () => {
      const props: ArtworkAuctionProgressBarProps = {
        extendedBiddingPeriodMinutes: 2,
        extendedBiddingIntervalMinutes: 2,
        startAt: new Date(Date.now()).toISOString(),
        biddingEndAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        hasBeenExtended: true,
      }

      const wrapper = renderWithWrappers(<ArtworkAuctionProgressBar {...props} />)

      expect(wrapper.UNSAFE_queryAllByType(ProgressBar).length).toBe(1)
    })
  })

  describe("when the lot hasn't been extended and is within the extended bidding period", () => {
    it("shows a progress bar", () => {
      const props: ArtworkAuctionProgressBarProps = {
        extendedBiddingPeriodMinutes: 2,
        extendedBiddingIntervalMinutes: 2,
        startAt: new Date(Date.now()).toISOString(),
        biddingEndAt: new Date(Date.now() + 1000 * 60 * 1.5).toISOString(),
        hasBeenExtended: false,
      }

      const wrapper = renderWithWrappers(<ArtworkAuctionProgressBar {...props} />)

      expect(wrapper.UNSAFE_queryAllByType(ProgressBar).length).toBe(1)
    })
  })
})
