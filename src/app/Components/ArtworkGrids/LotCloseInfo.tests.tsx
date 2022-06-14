import { render } from "@testing-library/react-native"
import { Theme } from "palette"
import React from "react"
import { DurationProvider } from "../Countdown"
import { LotCloseInfo } from "./LotCloseInfo"

// Today is Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
Date.now = () => 1525983752000

const basicSale = {
  isAuction: true,
  isClosed: false,
  displayTimelyAt: null,
  cascadingEndTimeIntervalMinutes: 1,
  extendedBiddingPeriodMinutes: 1,
  extendedBiddingIntervalMinutes: 1,
}

const basicSaleArtwork = {
  lotID: "lot-1",
  counts: null,
  formattedEndDateTime: "Formatted end date time",
  currentBid: null,
  lotLabel: "Lot 1",
  extendedBiddingEndAt: null,
}

describe("LotCloseInfo", () => {
  it("does not show any lot close info when the sale has not started", () => {
    // Sale start date in the future
    const sale = {
      startAt: "2019-04-19T11:12:48-04:00",
      endAt: "2019-04-25T11:12:48-04:00",
      ...basicSale,
    }
    const saleArtwork = {
      endAt: "2019-04-25T11:12:48-04:00",
      ...basicSaleArtwork,
    }
    const { getByText } = render(
      <Theme>
        <DurationProvider startAt={saleArtwork.endAt}>
          <LotCloseInfo
            lotEndAt={saleArtwork.endAt}
            duration={null}
            saleArtwork={saleArtwork}
            sale={sale}
            hasBeenExtended={false}
          />
        </DurationProvider>
      </Theme>
    )

    expect(() => getByText(/(Closed|Closes)$/)).toThrow()
  })

  it("shows the sale artwork's formatted end time when the sale has started but lots have not started closing", () => {
    // Sale has started but sale end date is in the future
    const sale = {
      startAt: "2018-05-09T11:12:48-04:00",
      endAt: "2018-05-25T11:12:48-04:00",
      ...basicSale,
    }
    const saleArtwork = {
      endAt: "2018-05-25T11:12:48-04:00",
      ...basicSaleArtwork,
    }
    const { getByText } = render(
      <Theme>
        <DurationProvider startAt={saleArtwork.endAt}>
          <LotCloseInfo
            lotEndAt={saleArtwork.endAt}
            duration={null}
            saleArtwork={saleArtwork}
            sale={sale}
            hasBeenExtended={false}
          />
        </DurationProvider>
      </Theme>
    )

    const lotCloseText = getByText("Formatted end date time")

    expect(lotCloseText).toBeTruthy()
    expect(lotCloseText.props.color).toEqual("black60")
  })

  it("shows the countdown when lots are less than a day from closing", () => {
    // Sale has started, lots have not started closing, sale artwork's end date is less than a day away
    const sale = {
      startAt: "2017-05-09T11:12:48-04:00",
      endAt: "2018-05-11T09:20:48-04:00",
      ...basicSale,
    }
    const saleArtwork = {
      endAt: "2018-05-11T10:50:50-04:00",
      ...basicSaleArtwork,
    }
    const { getByText } = render(
      <Theme>
        <DurationProvider startAt={saleArtwork.endAt}>
          <LotCloseInfo
            lotEndAt={saleArtwork.endAt}
            duration={null}
            saleArtwork={saleArtwork}
            sale={sale}
            hasBeenExtended={false}
          />
        </DurationProvider>
      </Theme>
    )

    const lotCloseText = getByText("Closes, 18h 28m")

    expect(lotCloseText).toBeTruthy()
    expect(lotCloseText.props.color).toEqual("black100")
  })

  it("shows the countdown when lots are actively closing", () => {
    // Sale has started and lots have started closing (sale end time has passed)
    const sale = {
      startAt: "2017-05-09T11:12:48-04:00",
      endAt: "2018-05-09T05:20:48-04:00",
      ...basicSale,
    }
    const saleArtwork = {
      endAt: "2018-05-11T10:50:50-04:00",
      ...basicSaleArtwork,
    }
    const { getByText } = render(
      <Theme>
        <DurationProvider startAt={saleArtwork.endAt}>
          <LotCloseInfo
            lotEndAt={saleArtwork.endAt}
            duration={null}
            saleArtwork={saleArtwork}
            sale={sale}
            hasBeenExtended={false}
          />
        </DurationProvider>
      </Theme>
    )

    const lotCloseText = getByText("Closes, 18h 28m")

    expect(lotCloseText).toBeTruthy()
    expect(lotCloseText.props.color).toEqual("black100")
  })

  it("shows the countdown in red when lot is less than the cascade interval amount from closing", () => {
    // Sale artwork is <1 min from closing
    const sale = {
      startAt: "2017-05-09T11:12:48-04:00",
      endAt: "2018-05-10T05:20:48-04:00",
      ...basicSale,
    }
    const saleArtwork = {
      endAt: "2018-05-10T16:22:50-04:00",
      ...basicSaleArtwork,
    }
    const { getByText } = render(
      <Theme>
        <DurationProvider startAt={saleArtwork.endAt}>
          <LotCloseInfo
            duration={null}
            lotEndAt={saleArtwork.endAt}
            saleArtwork={saleArtwork}
            sale={sale}
            hasBeenExtended={false}
          />
        </DurationProvider>
      </Theme>
    )

    const lotCloseText = getByText("Closes, 0m 18s")

    expect(lotCloseText).toBeTruthy()
    expect(lotCloseText.props.color).toEqual("red100")
  })

  it("shows Closed when the sale is over", () => {
    const sale = {
      startAt: "2017-04-19T11:12:48-04:00",
      endAt: "2017-04-25T11:12:48-04:00",
      ...basicSale,
    }
    const saleArtwork = {
      endAt: "2017-04-25T11:12:48-04:00",
      ...basicSaleArtwork,
    }
    const { getByText } = render(
      <Theme>
        <DurationProvider startAt={saleArtwork.endAt}>
          <LotCloseInfo
            duration={null}
            lotEndAt={saleArtwork.endAt}
            saleArtwork={saleArtwork}
            sale={sale}
            hasBeenExtended={false}
          />
        </DurationProvider>
      </Theme>
    )

    const lotCloseText = getByText("Closed")

    expect(lotCloseText).toBeTruthy()
    expect(lotCloseText.props.color).toEqual("black60")
  })

  it("shows Extended when the sale is extended", () => {
    const sale = {
      ...basicSale,
      startAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      endAt: new Date(Date.now() + 1000 * 60).toISOString(),
    }
    const saleArtwork = {
      ...basicSaleArtwork,
      endAt: sale.endAt,
      extendedBiddingEndAt: new Date(Date.now() + 1000 * 60 * 2).toISOString(),
    }

    const { getByText } = render(
      <Theme>
        <DurationProvider startAt={saleArtwork.extendedBiddingEndAt}>
          <LotCloseInfo
            lotEndAt={saleArtwork.extendedBiddingEndAt}
            duration={null}
            saleArtwork={saleArtwork}
            sale={sale}
            hasBeenExtended
          />
        </DurationProvider>
      </Theme>
    )

    const lotCloseText = getByText("Extended, 2m 0s")

    expect(lotCloseText).toBeTruthy()
    expect(lotCloseText.props.color).toEqual("red100")
  })
})
