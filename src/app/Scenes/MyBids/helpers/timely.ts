import { DateTime } from "luxon"

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
    this.status = sale?.status!
    this.endAt = sale?.endAt!
    this.liveStartAt = sale?.liveStartAt!
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

    const now = DateTime.now()
    const liveStartMoment = DateTime.fromISO(this.liveStartAt!)

    return now > liveStartMoment
  }
}
