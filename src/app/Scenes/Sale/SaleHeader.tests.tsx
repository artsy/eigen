import { act, screen } from "@testing-library/react-native"
import { SaleHeaderTestsQuery } from "__generated__/SaleHeaderTestsQuery.graphql"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { mockTimezone } from "app/utils/tests/mockTimezone"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import moment from "moment"
import { Animated } from "react-native"
import { graphql } from "react-relay"
import { SaleHeaderContainer } from "./Components/SaleHeader"

describe("SaleHeader", () => {
  const { renderWithRelay } = setupTestWrapper<SaleHeaderTestsQuery>({
    Component: (props) => (
      <SaleHeaderContainer scrollAnim={new Animated.Value(0)} {...props} sale={props.sale!} />
    ),
    query: graphql`
      query SaleHeaderTestsQuery @relay_test_operation {
        sale(id: "the-sale") {
          ...SaleHeader_sale
        }
      }
    `,
  })

  beforeEach(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
    mockTimezone("America/New_York")
  })

  it("renders without throwing an error", () => {
    renderWithRelay({
      Sale: () => ({
        endAt: "2020-11-01T15:00:00",
        startAt: "2020-10-01T15:00:00",
        timeZone: "Europe/Berlin",
        coverImage: {
          url: "cover image url",
        },
        name: "sale name",
        liveStartAt: "2020-10-01T15:00:00",
        internalID: "the-sale-internal",
      }),
    })

    expect(screen.getByTestId("saleName")).toHaveTextContent("sale name")
    expect(screen.UNSAFE_getAllByType(CaretButton)).toHaveLength(1)
  })

  it("does not render auction is closed when cascading end time is enabled", () => {
    renderWithRelay({
      Sale: () => ({
        endAt: moment().subtract(1, "day").toISOString(),
        startAt: "2020-09-01T15:00:00",
        timeZone: "Europe/Berlin",
        coverImage: {
          url: "cover image url",
        },
        name: "sale name",
        liveStartAt: "2020-09-01T15:00:00",
        internalID: "the-sale-internal",
        cascadingEndTimeIntervalMinutes: 1,
      }),
    })

    expect(screen.queryByText("Auction closed")).not.toBeOnTheScreen()
  })

  it("does not render auction is closed when an auction is still active", () => {
    renderWithRelay({
      Sale: () => ({
        endAt: moment().add(1, "day").toISOString(),
        startAt: "2020-09-01T15:00:00",
        timeZone: "Europe/Berlin",
        coverImage: {
          url: "cover image url",
        },
        name: "sale name",
        liveStartAt: "2020-09-01T15:00:00",
        internalID: "the-sale-internal",
      }),
    })

    expect(screen.queryByText("Auction closed")).not.toBeOnTheScreen()
  })

  describe("cascading end times", () => {
    const baseSale = {
      timeZone: "Europe/Berlin",
      coverImage: {
        url: "cover image url",
      },
      name: "sale name",
      liveStartAt: "2020-09-01T15:00:00",
      internalID: "the-sale-internal",
    }

    beforeEach(() => {
      Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
    })

    describe("when the cascade end time flag is turned on", () => {
      beforeEach(() => {
        jest.useFakeTimers({
          legacyFakeTimers: true,
        })
      })

      it("shows the cascading end time label", () => {
        renderWithRelay({
          Sale: () => ({
            endAt: "2018-05-16T15:00:00",
            startAt: "2018-05-13T15:00:00",
            endedAt: null,
            cascadingEndTimeIntervalMinutes: 1,
            ...baseSale,
          }),
        })

        const cascadeEndTimeLabel = screen.queryByText("Lots close at 1-minute intervals")
        expect(cascadeEndTimeLabel).toBeOnTheScreen()
      })

      describe("absolute date label", () => {
        it("shows the start date if the sale has not started", () => {
          renderWithRelay({
            Sale: () => ({
              endAt: "2018-05-16T15:00:00",
              startAt: "2018-05-11T15:00:00",
              endedAt: null,
              cascadingEndTimeIntervalMinutes: 1,
              ...baseSale,
            }),
          })

          const absoluteTime = screen.queryByText("May 11, 2018 • 9:00am EDT")
          expect(absoluteTime).toBeOnTheScreen()
        })

        it("shows the end date if the sale has started", () => {
          renderWithRelay({
            Sale: () => ({
              endAt: "2018-05-16T15:00:00",
              startAt: "2018-05-09T15:00:00",
              endedAt: null,
              cascadingEndTimeIntervalMinutes: 1,
              ...baseSale,
            }),
          })

          const absoluteTime = screen.queryByText("May 16, 2018 • 9:00am EDT")
          expect(absoluteTime).toBeOnTheScreen()
        })
      })

      describe("relative date label", () => {
        it("shows minutes and seconds left until bidding starts", () => {
          jest.useFakeTimers({ legacyFakeTimers: true })

          renderWithRelay({
            Sale: () => ({
              endAt: "2018-05-16T15:00:00",
              startAt: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
              endedAt: null,
              slug: "the weird one",
              cascadingEndTimeIntervalMinutes: 1,
              ...baseSale,
            }),
          })

          act(() => {
            jest.advanceTimersByTime(1000)
          })

          const relativeTime = screen.queryByText("10m 0s Until Bidding Starts")
          expect(relativeTime).toBeOnTheScreen()
        })

        it("shows Days left until bidding starts", () => {
          renderWithRelay({
            Sale: () => ({
              endAt: "2018-05-16T15:00:00",
              startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
              endedAt: null,
              cascadingEndTimeIntervalMinutes: 1,
              ...baseSale,
            }),
          })

          act(() => {
            jest.advanceTimersByTime(1000)
          })

          const relativeTime = screen.queryByText("3 Days Until Bidding Starts")
          expect(relativeTime).toBeOnTheScreen()
        })

        it("shows 6 Days Until Lots Start Closing if the sale started and ends in 6+ days", () => {
          renderWithRelay({
            Sale: () => ({
              endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6.5).toISOString(),
              startAt: "2018-05-09T15:00:00",
              endedAt: null,
              cascadingEndTimeIntervalMinutes: 1,
              ...baseSale,
            }),
          })

          act(() => {
            jest.advanceTimersByTime(1000)
          })

          const relativeTime = screen.queryByText("6 Days Until Lots Start Closing")
          expect(relativeTime).toBeOnTheScreen()
        })

        it("shows 9h37m if the sale started and ends in less than 24 hours but > 1 hour", () => {
          const nineHoursAndThirtySevenMins = 1000 * 60 * 60 * 9 + 1000 * 60 * 37
          renderWithRelay({
            Sale: () => ({
              endAt: new Date(Date.now() + nineHoursAndThirtySevenMins).toISOString(),
              startAt: "2018-05-09T20:00:00",
              endedAt: null,
              cascadingEndTimeIntervalMinutes: 1,
              ...baseSale,
            }),
          })

          act(() => {
            jest.advanceTimersByTime(1000)
          })

          const relativeTime = screen.queryByText("9h 37m Until Lots Start Closing")
          expect(relativeTime).toBeOnTheScreen()
        })

        it("shows 37m28s if the sale started and ends in 37+ minutes", () => {
          const ThirtySevenMinsAndTwentyEightSecs = 1000 * 60 * 37 + 28 * 1000

          renderWithRelay({
            Sale: () => ({
              endAt: new Date(Date.now() + ThirtySevenMinsAndTwentyEightSecs).toISOString(),
              startAt: "2018-05-09T15:00:00",
              endedAt: null,
              cascadingEndTimeIntervalMinutes: 1,
              ...baseSale,
            }),
          })

          act(() => {
            jest.advanceTimersByTime(1000)
          })

          const relativeTime = screen.queryByText("37m 28s Until Lots Start Closing")
          expect(relativeTime).toBeOnTheScreen()
        })

        it("shows Lots are closing the sale started and the sale end date has passed", () => {
          renderWithRelay({
            Sale: () => ({
              endAt: "2018-05-09T18:00:00",
              startAt: "2018-05-08T15:00:00",
              endedAt: null,
              cascadingEndTimeIntervalMinutes: 1,
              ...baseSale,
            }),
          })

          act(() => {
            jest.advanceTimersByTime(1000)
          })

          const relativeTime = screen.queryByText("Lots are closing")
          expect(relativeTime).toBeOnTheScreen()
        })

        it("shows Closed date if the last lots closed", () => {
          renderWithRelay({
            Sale: () => ({
              endAt: "2018-05-09T18:00:00",
              endedAt: "2018-05-08T18:00:00",
              startAt: "2018-05-07T15:00:00",
              cascadingEndTimeIntervalMinutes: 1,
              ...baseSale,
            }),
          })

          const absoluteTime = screen.queryByText("Closed May 8, 2018 • 12:00pm EDT")
          expect(absoluteTime).toBeOnTheScreen()
        })
      })
    })
  })
})
