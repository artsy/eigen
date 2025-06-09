import { screen } from "@testing-library/react-native"
import { ArtworkLotTimer_artwork$data } from "__generated__/ArtworkLotTimer_artwork.graphql"
import { ArtworkStoreProvider } from "app/Scenes/Artwork/ArtworkStore"
import { ArtworkLotTimerWrapper } from "app/Scenes/Artwork/Components/ArtworkLotTimer"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { DateTime } from "luxon"

describe("CommercialInformation buttons and coundtown timer", () => {
  it("renders Lot label and CountDownTimer when Artwork is in an auction", async () => {
    renderWithWrappers(
      <ArtworkStoreProvider>
        <ArtworkLotTimerWrapper
          artwork={artwork}
          tracking={{ trackEvent: jest.fn() } as any}
          refetchArtwork={jest.fn()}
          hasStarted
        />
      </ArtworkStoreProvider>
    )

    expect(screen.getByText("Lot 123")).toBeOnTheScreen()
    expect(screen.getByLabelText("CountdownTimer")).toBeOnTheScreen()
    expect(screen.getByText("31 Watchers")).toBeOnTheScreen()
  })

  it("renders CountDownTimer with the sale artwork's end time when Artwork is in a cascading end time auction", () => {
    renderWithWrappers(
      <ArtworkStoreProvider>
        <ArtworkLotTimerWrapper
          artwork={artwork}
          tracking={{ trackEvent: jest.fn() } as any}
          refetchArtwork={jest.fn()}
          hasStarted
        />
      </ArtworkStoreProvider>
    )

    expect(screen.getByText("Lot 123")).toBeOnTheScreen()
    expect(screen.getByLabelText("CountdownTimer")).toBeOnTheScreen()
    expect(screen.getByText("3d 7h")).toBeOnTheScreen()
  })

  it("should render bidding closed and no timer if bidding is closed", () => {
    renderWithWrappers(
      <ArtworkStoreProvider>
        <ArtworkLotTimerWrapper
          artwork={
            {
              ...artwork,
              saleArtwork: { ...artwork.saleArtwork, endedAt: "2019-08-16T20:20:00+00:00" },
            } as ArtworkLotTimer_artwork$data
          }
          tracking={{ trackEvent: jest.fn() } as any}
          refetchArtwork={jest.fn()}
          hasStarted
        />
      </ArtworkStoreProvider>
    )

    expect(screen.getByText("Lot 123")).toBeOnTheScreen()
    expect(screen.getByText("Bidding closed")).toBeOnTheScreen()
    expect(screen.queryByText("CountdownTimer")).toBeNull()
  })
})

const artwork: ArtworkLotTimer_artwork$data = {
  isInAuction: true,
  isForSale: true,
  sale: {
    cascadingEndTimeIntervalMinutes: 1,
    startAt: DateTime.now().minus({ days: 7, hours: 3, minutes: 30 }).toISO(),
    endAt: DateTime.now().plus({ days: 3, hours: 7, minutes: 49 }).toISO(),
    extendedBiddingIntervalMinutes: null,
    extendedBiddingPeriodMinutes: null,
    internalID: "internal-id",
    isClosed: false,
    isPreview: false,
    liveStartAt: null,
  },
  saleArtwork: {
    endAt: DateTime.now().plus({ days: 3, hours: 7, minutes: 49 }).toISO(),
    endedAt: null,
    extendedBiddingEndAt: null,
    lotID: "internal-id",
    lotLabel: "123",
  },
  collectorSignals: {
    auction: {
      lotWatcherCount: 31,
    },
  },
  " $fragmentType": "ArtworkLotTimer_artwork",
}
