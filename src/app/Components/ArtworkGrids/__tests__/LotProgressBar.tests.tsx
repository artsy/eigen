import { screen } from "@testing-library/react-native"
import { LotProgressBar, LotProgressBarProps } from "app/Components/ArtworkGrids/LotProgressBar"
import { DurationProvider } from "app/Components/Countdown"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Duration } from "luxon"

describe("LotProgressBar", () => {
  const getWrapper = (props: LotProgressBarProps) => {
    return renderWithWrappers(
      <DurationProvider startAt={props.biddingEndAt!}>
        <LotProgressBar {...props} />
      </DurationProvider>
    )
  }

  describe("Shows A ProgressBar", () => {
    it("Shows if extendedBiddingEndAt or endAt is in the future and within now and extendedBiddingIntervalMinutes", async () => {
      const props = {
        extendedBiddingPeriodMinutes: 2,
        extendedBiddingIntervalMinutes: 2,
        startAt: new Date(Date.now()).toISOString(),
        biddingEndAt: new Date(Date.now() + 1000).toISOString(),
        hasBeenExtended: false,
        duration: null,
      }

      await getWrapper(props)

      expect(screen.getAllByTestId("progress-bar-track")).toHaveLength(1)
    })
  })

  describe("Does Not Show A ProgressBar", () => {
    afterAll(() => {
      jest.clearAllMocks()
    })

    it("Does not show if extendedBiddingEndAt or endAt is past", async () => {
      const props = {
        extendedBiddingPeriodMinutes: 2,
        extendedBiddingIntervalMinutes: 2,
        startAt: new Date(Date.now()).toISOString(),
        biddingEndAt: new Date(Date.now() - 1000).toISOString(),
        hasBeenExtended: false,
        duration: null,
      }

      await getWrapper(props)

      expect(screen.queryByTestId("progress-bar-track")).not.toBeOnTheScreen()
    })

    it("ProgressBar disappears when time elapses", async () => {
      const now = new Date(Date.now()).toISOString()
      const props = {
        extendedBiddingPeriodMinutes: 2,
        extendedBiddingIntervalMinutes: 2,
        startAt: now,
        biddingEndAt: now,
        hasBeenExtended: true,
        duration: Duration.fromMillis(0),
      }

      await getWrapper(props)

      expect(screen.queryByTestId("progress-bar-track")).not.toBeOnTheScreen()
    })
  })
})
