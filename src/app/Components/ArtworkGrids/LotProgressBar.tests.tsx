import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { DateTime } from "luxon"
import moment from "moment"
import { ProgressBar } from "palette"
import React from "react"
import { DurationProvider } from "../Countdown"
import { LotProgressBar, LotProgressBarProps } from "./LotProgressBar"

describe("LotProgressBar", () => {
  const getWrapper = (props: LotProgressBarProps) => {
    return renderWithWrappersTL(
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

      const wrapper = getWrapper(props)

      expect(wrapper.UNSAFE_queryAllByType(ProgressBar).length).toBe(1)
    })
  })

  describe("Does Not Show A ProgressBar", () => {
    afterAll(() => {
      jest.clearAllMocks()
    })

    it("Does not show if extendedBiddingEndAt or endAt is  past", () => {
      const props = {
        extendedBiddingPeriodMinutes: 2,
        extendedBiddingIntervalMinutes: 2,
        startAt: new Date(Date.now()).toISOString(),
        biddingEndAt: new Date(Date.now() - 1000).toISOString(),
        hasBeenExtended: false,
        duration: null,
      }

      const wrapper = getWrapper(props)

      expect(wrapper.UNSAFE_queryAllByType(ProgressBar).length).toBe(0)
    })

    it("ProgressBar disappears when time elapses", () => {
      // 2 mins
      const biddingEndAt = new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString()
      const props = {
        extendedBiddingPeriodMinutes: 2,
        extendedBiddingIntervalMinutes: 2,
        startAt: new Date(Date.now()).toISOString(),
        biddingEndAt,
        hasBeenExtended: true,
        duration: moment.duration(DateTime.fromISO(biddingEndAt).toMillis()),
      }

      jest.useFakeTimers()

      const wrapper = getWrapper(props)

      expect(wrapper.UNSAFE_queryAllByType(ProgressBar).length).toBe(1)

      jest.advanceTimersByTime(1000 * 60 * 60 * 2)

      expect(wrapper.UNSAFE_queryAllByType(ProgressBar).length).toBe(0)
    })
  })
})
