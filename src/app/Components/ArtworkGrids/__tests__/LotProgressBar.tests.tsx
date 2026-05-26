import { ProgressBar } from "@artsy/palette-mobile"
import { LotProgressBar, LotProgressBarProps } from "app/Components/ArtworkGrids/LotProgressBar"
import { DurationProvider } from "app/Components/Countdown"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import moment from "moment"

describe("LotProgressBar", () => {
  const getWrapper = (props: LotProgressBarProps) => {
    return renderWithWrappers(
      <DurationProvider startAt={props.biddingEndAt!}>
        <LotProgressBar {...props} />
      </DurationProvider>
    )
  }

  describe("Shows A ProgressBar", () => {
    it("Shows if extendedBiddingEndAt or endAt is in the future and within now and extendedBiddingIntervalMinutes", () => {
      const props = {
        extendedBiddingPeriodMinutes: 2,
        extendedBiddingIntervalMinutes: 2,
        startAt: new Date(Date.now()).toISOString(),
        biddingEndAt: new Date(Date.now() + 1000).toISOString(),
        hasBeenExtended: false,
        duration: null,
      }

      const { UNSAFE_queryAllByType } = getWrapper(props)

      expect(UNSAFE_queryAllByType(ProgressBar).length).toBe(1)
    })
  })

  describe("Does Not Show A ProgressBar", () => {
    afterAll(() => {
      jest.clearAllMocks()
    })

    it("Does not show if extendedBiddingEndAt or endAt is past", () => {
      const props = {
        extendedBiddingPeriodMinutes: 2,
        extendedBiddingIntervalMinutes: 2,
        startAt: new Date(Date.now()).toISOString(),
        biddingEndAt: new Date(Date.now() - 1000).toISOString(),
        hasBeenExtended: false,
        duration: null,
      }

      const { UNSAFE_queryAllByType } = getWrapper(props)

      expect(UNSAFE_queryAllByType(ProgressBar).length).toBe(0)
    })

    it("ProgressBar disappears when time elapses", () => {
      const now = new Date(Date.now()).toISOString()
      const props = {
        extendedBiddingPeriodMinutes: 2,
        extendedBiddingIntervalMinutes: 2,
        startAt: now,
        biddingEndAt: now,
        hasBeenExtended: true,
        duration: moment.duration(),
      }

      const { UNSAFE_queryAllByType } = getWrapper(props)

      expect(UNSAFE_queryAllByType(ProgressBar).length).toBe(0)
    })
  })
})
