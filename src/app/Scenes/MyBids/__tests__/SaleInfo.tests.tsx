import { screen } from "@testing-library/react-native"
import { SaleInfo } from "app/Scenes/MyBids/Components/SaleInfo"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { merge } from "lodash"
import { DateTime, Settings } from "luxon"

jest.mock("@artsy/icons/native", () => {
  const { View } = require("react-native")
  return {
    ...jest.requireActual("@artsy/icons/native"),
    BoltFillIcon: (props: any) => <View testID="bolt-fill-icon" {...props} />,
    StopwatchIcon: (props: any) => <View testID="stopwatch-icon" {...props} />,
  }
})

Settings.now = () => Date.parse("2020-07-31T05:21:14+00:00")
Settings.defaultZone = "America/New_York"

// Renders the node and returns the root host element, whose text content is the rendered text
const renderText = async (node: React.ReactElement) => {
  await renderWithWrappers(node)
  return screen.root
}

interface SaleInfoProps {
  liveStartAt?: string | null
  endAt?: string | null
  status?: string | null
}

const BLUE_100 = "#1023D7"
// copper100 isn't a palette token, so the raw value is passed through as the style color
const COPPER_100 = "copper100"

const saleFixture: (overrides: SaleInfoProps) => SaleInfoProps = (overrides = {}) =>
  merge({ status: "open" }, overrides)

describe(SaleInfo, () => {
  describe("live sale", () => {
    it("has a lightning bolt", async () => {
      await renderWithWrappers(
        <SaleInfo sale={saleFixture({ liveStartAt: "2020-08-01T15:00:00+00:00" })} />
      )

      expect(screen.getAllByTestId("bolt-fill-icon")).toHaveLength(1)
    })

    describe("live bidding in progress", () => {
      const renderLiveSale = async () => {
        const liveStartAt = DateTime.now().minus({ minutes: 5 }).toJSON()
        await renderWithWrappers(<SaleInfo sale={saleFixture({ liveStartAt, status: "open" })} />)
      }
      it("has a blue100 icon + note if live bidding is active, mono60 otherwise", async () => {
        await renderLiveSale()
        expect(screen.getByTestId("bolt-fill-icon")).toHaveProp("fill", "blue100")
      })
      it("has blue100 text", async () => {
        await renderLiveSale()
        expect(screen.getByText("Live bidding in progress")).toHaveStyle({ color: BLUE_100 })
      })
      it("has no line 2 text", async () => {
        await renderLiveSale()
        // The only rendered text is line 1
        expect(screen.root).toHaveTextContent("Live bidding in progress")
      })
    })

    describe("time bounds", () => {
      it("displays 'today' and time (with no second line) if the sale goes live on the same day but more than 10 hours away", async () => {
        const view = await renderText(
          <SaleInfo sale={saleFixture({ liveStartAt: "2020-07-31T18:00:00+00:00" })} />
        )

        expect(view).toHaveTextContent("Live bidding begins today at 2:00 p.m. (EDT)")
      })

      it("displays an additional timely message in hours the sale is within 10 hours", async () => {
        const view = await renderText(
          <SaleInfo sale={saleFixture({ liveStartAt: "2020-07-31T12:00:00+00:00" })} />
        )

        expect(view).toHaveTextContent("Live bidding begins today at 8:00 a.m. (EDT)", {
          exact: false,
        })
        expect(view).toHaveTextContent("Opens in 6 hours", { exact: false })
      })

      it("displays an additional timely message in minutes if the sale is within 1 hour", async () => {
        const view = await renderText(
          <SaleInfo sale={saleFixture({ liveStartAt: "2020-07-31T06:00:00+00:00" })} />
        )

        // Exactly two lines: line 1 + the copper100 line 2
        expect(view).toHaveTextContent(
          "Live bidding begins today at 2:00 a.m. (EDT)Opens in 38 minutes"
        )
        expect(screen.getByText("Opens in 38 minutes")).toHaveStyle({ color: COPPER_100 })

        expect(view).toHaveTextContent("Live bidding begins today at 2:00 a.m. (EDT)", {
          exact: false,
        })
        expect(view).toHaveTextContent("Opens in 38 minutes", { exact: false })
      })

      it("displays 'Live bidding begins today' and time if the live sale begins on the same calendar day", async () => {
        expect(
          await renderText(
            <SaleInfo sale={saleFixture({ liveStartAt: "2020-07-31T15:00:00+00:00" })} />
          )
        ).toHaveTextContent("Live bidding begins today at 11:00 a.m. (EDT)", { exact: false })
        expect(
          await renderText(
            <SaleInfo sale={saleFixture({ liveStartAt: "2020-07-31T16:00:00+00:00" })} />
          )
        ).toHaveTextContent("Live bidding begins today at 12:00 p.m. (EDT)", { exact: false })
      })

      it("displays 'Live bidding begins tomorrow' and time if the sale goes live on the following calendar day", async () => {
        // This case might be a little counter-intuitive to a user, but it is technically correct
        expect(
          await renderText(
            <SaleInfo sale={saleFixture({ liveStartAt: "2020-08-01T04:45:00+00:00" })} />
          )
        ).toHaveTextContent("Live bidding begins tomorrow at 12:45 a.m. (EDT)")
        expect(
          await renderText(
            <SaleInfo sale={saleFixture({ liveStartAt: "2020-08-01T05:00:00+00:00" })} />
          )
        ).toHaveTextContent("Live bidding begins tomorrow at 1:00 a.m. (EDT)")
        expect(
          await renderText(
            <SaleInfo sale={saleFixture({ liveStartAt: "2020-08-01T15:00:00+00:00" })} />
          )
        ).toHaveTextContent("Live bidding begins tomorrow at 11:00 a.m. (EDT)")
        expect(
          await renderText(
            <SaleInfo sale={saleFixture({ liveStartAt: "2020-08-01T16:00:00+00:00" })} />
          )
        ).toHaveTextContent("Live bidding begins tomorrow at 12:00 p.m. (EDT)")
        expect(
          await renderText(
            <SaleInfo sale={saleFixture({ liveStartAt: "2020-08-01T17:00:00+00:00" })} />
          )
        ).toHaveTextContent("Live bidding begins tomorrow at 1:00 p.m. (EDT)")
      })

      it("displays 'Live bidding begins at' and date if the sale goes live after tomorrow", async () => {
        expect(
          await renderText(
            <SaleInfo sale={saleFixture({ liveStartAt: "2020-08-07T15:00:00+00:00" })} />
          )
        ).toHaveTextContent("Live bidding begins Aug. 7th at 11:00 a.m. (EDT)")
        expect(
          await renderText(
            <SaleInfo sale={saleFixture({ liveStartAt: "2020-08-02T15:00:00+00:00" })} />
          )
        ).toHaveTextContent("Live bidding begins Aug. 2nd at 11:00 a.m. (EDT)")
        expect(
          await renderText(
            <SaleInfo sale={saleFixture({ liveStartAt: "2020-08-03T16:00:00+00:00" })} />
          )
        ).toHaveTextContent("Live bidding begins Aug. 3rd at 12:00 p.m. (EDT)")
        expect(
          await renderText(
            <SaleInfo sale={saleFixture({ liveStartAt: "2020-08-02T17:00:00+00:00" })} />
          )
        ).toHaveTextContent("Live bidding begins Aug. 2nd at 1:00 p.m. (EDT)")
      })
    })
  })

  describe("timed auction", () => {
    it("has a little stopwatch", async () => {
      await renderWithWrappers(
        <SaleInfo sale={saleFixture({ endAt: "2020-08-01T15:00:00+00:00" })} />
      )

      expect(screen.getAllByTestId("stopwatch-icon")).toHaveLength(1)
    })
    describe("time bounds", () => {
      it("displays 'today' and time (with no second line) if the sale goes live on the same day but more than 10 hours away", async () => {
        const view = await renderText(
          <SaleInfo sale={saleFixture({ endAt: "2020-07-31T18:00:00+00:00" })} />
        )

        expect(view).toHaveTextContent("Closes today at 2:00 p.m. (EDT)")
      })

      it("displays an additional timely message in hours the sale is within 10 hours", async () => {
        const view = await renderText(
          <SaleInfo sale={saleFixture({ endAt: "2020-07-31T12:00:00+00:00" })} />
        )

        expect(view).toHaveTextContent("Closes today at 8:00 a.m.", { exact: false })
        expect(view).toHaveTextContent("Ends in 6 hours", { exact: false })
      })

      it("displays an additional timely message in minutes if the sale is within 1 hour", async () => {
        const view = await renderText(
          <SaleInfo sale={saleFixture({ endAt: "2020-07-31T06:00:00+00:00" })} />
        )

        // Exactly two lines: line 1 + the copper100 line 2
        expect(view).toHaveTextContent("Closes today at 2:00 a.m. (EDT)Ends in 38 minutes")
        expect(screen.getByText("Ends in 38 minutes")).toHaveStyle({ color: COPPER_100 })
        expect(view).toHaveTextContent("Closes today at 2:00 a.m.", { exact: false })
        expect(view).toHaveTextContent("Ends in 38 minutes", { exact: false })
      })

      it("displays 'Closes today' and time if the sale closes on the same calendar day", async () => {
        expect(
          await renderText(<SaleInfo sale={saleFixture({ endAt: "2020-07-31T15:00:00+00:00" })} />)
        ).toHaveTextContent("Closes today at 11:00 a.m. (EDT)", { exact: false })
        expect(
          await renderText(<SaleInfo sale={saleFixture({ endAt: "2020-07-31T16:00:00+00:00" })} />)
        ).toHaveTextContent("Closes today at 12:00 p.m. (EDT)", { exact: false })
        expect(
          await renderText(<SaleInfo sale={saleFixture({ endAt: "2020-07-31T17:00:00+00:00" })} />)
        ).toHaveTextContent("Closes today at 1:00 p.m. (EDT)", { exact: false })
      })

      it("displays 'Closes tomorrow' and time if the sale closes on the following calendar day", async () => {
        // This case might be a little counter-intuitive to a user, but it is technically correct
        expect(
          await renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-01T04:45:00+00:00" })} />)
        ).toHaveTextContent("Closes tomorrow at 12:45 a.m. (EDT)")
        expect(
          await renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-01T05:00:00+00:00" })} />)
        ).toHaveTextContent("Closes tomorrow at 1:00 a.m. (EDT)")
        expect(
          await renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-01T15:00:00+00:00" })} />)
        ).toHaveTextContent("Closes tomorrow at 11:00 a.m. (EDT)")
        expect(
          await renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-01T16:00:00+00:00" })} />)
        ).toHaveTextContent("Closes tomorrow at 12:00 p.m. (EDT)")
        expect(
          await renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-01T17:00:00+00:00" })} />)
        ).toHaveTextContent("Closes tomorrow at 1:00 p.m. (EDT)")
      })

      it("displays 'Closes at' and full date if the sale closes in more than 48 hours", async () => {
        expect(
          await renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-02T15:00:00+00:00" })} />)
        ).toHaveTextContent("Closes Aug. 2nd at 11:00 a.m. (EDT)")
        expect(
          await renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-02T16:00:00+00:00" })} />)
        ).toHaveTextContent("Closes Aug. 2nd at 12:00 p.m. (EDT)")
        expect(
          await renderText(<SaleInfo sale={saleFixture({ endAt: "2020-08-02T17:00:00+00:00" })} />)
        ).toHaveTextContent("Closes Aug. 2nd at 1:00 p.m. (EDT)")
      })
    })
  })
})
