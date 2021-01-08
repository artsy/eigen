import moment from "moment-timezone"

/** Whether lot is in one of its pre-closed states */
export const lotInActiveSale: (lotStanding: {
  saleArtwork: { sale: { status: string | null } | null } | null
}) => boolean = (lotStanding) => {
  const status = lotStanding?.saleArtwork?.sale?.status
  return !!status && ["open", "preview"].includes(status.toLowerCase())
}

/** Whether the lot has been completed, regardless of the sale's closed status. Lot is no longer for sale, either it has been sold or is no longer available for bidding. */
export const isLotStandingComplete: (lotStanding: { lot?: { soldStatus?: string } }) => boolean = (lotStanding) =>
  !!(lotStanding.lot?.soldStatus && ["sold", "passed"].includes(lotStanding.lot.soldStatus?.toLowerCase()))

interface SaleWithTimes {
  status?: string | null
  liveStartAt?: string | null
  endAt?: string | null
}

export class TimelySale {
  static create(sale: SaleWithTimes): TimelySale {
    return new TimelySale(sale)
  }
  private status: string
  private endAt: string
  private liveStartAt: string

  constructor(sale: SaleWithTimes) {
    this.status = sale.status!
    this.endAt = sale.endAt!
    this.liveStartAt = sale.liveStartAt!
  }

  get isLAI() {
    return !!this.liveStartAt
  }

  get isClosed() {
    return this.status === "closed"
  }

  get isActive() {
    return ["open", "preview"].includes(this.status)
  }

  get relevantEnd(): string {
    return this.isLAI ? this.liveStartAt : this.endAt
  }

  isLiveBiddingNow(): boolean {
    if (this.isClosed || !this.isLAI) {
      return false
    }

    const tz = moment.tz.guess(true)
    const now = moment().tz(tz)
    const liveStartMoment = moment(this.liveStartAt!).tz(tz)

    return now.isAfter(liveStartMoment)
  }
}
