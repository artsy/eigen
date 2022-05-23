import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { ProgressBar } from "palette"
import React from "react"
import { DurationProvider } from "../Countdown"
import { LotProgressBar, LotProgressBarProps } from "./LotProgressBar"

describe("LotProgressBar", () => {
  const getWrapper = (props: LotProgressBarProps) => {
    const endsAt = props.extendedBiddingEndAt || props.endAt
    return renderWithWrappersTL(
      <DurationProvider startAt={endsAt!}>
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
        endAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        extendedBiddingEndAt: new Date(Date.now() + 1000).toISOString(),
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
        endAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        extendedBiddingEndAt: new Date(Date.now() - 1000).toISOString(),
        duration: null,
      }

      const wrapper = getWrapper(props)

      expect(wrapper.UNSAFE_queryAllByType(ProgressBar).length).toBe(0)
    })

    it("ProgressBar disappears when time elapses", () => {
      const props = {
        extendedBiddingPeriodMinutes: 2,
        extendedBiddingIntervalMinutes: 2,
        startAt: new Date(Date.now()).toISOString(),
        endAt: new Date(Date.now() + 1000).toISOString(),
        // 2 mins
        extendedBiddingEndAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        duration: null,
      }

      jest.useFakeTimers()

      const wrapper = getWrapper(props)

      expect(wrapper.UNSAFE_queryAllByType(ProgressBar).length).toBe(1)

      jest.advanceTimersByTime(1000 * 60 * 60)

      expect(wrapper.UNSAFE_queryAllByType(ProgressBar).length).toBe(0)
    })
  })
})
