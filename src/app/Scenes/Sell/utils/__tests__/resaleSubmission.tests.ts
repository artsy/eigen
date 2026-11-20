import {
  ResaleSubmission,
  isResaleSubmissionSellable,
} from "app/Scenes/Sell/utils/resaleSubmission"

const resaleSubmission = (overrides: Partial<ResaleSubmission>): ResaleSubmission => ({
  internalID: "resale-submission-1",
  state: "ACCEPTED",
  channel: "MARKETPLACE",
  estimate: null,
  statusMessage: "In progress",
  ...overrides,
})

describe("isResaleSubmissionSellable", () => {
  it("sells an accepted submission on a channel the app supports", () => {
    expect(isResaleSubmissionSellable(resaleSubmission({}))).toBe(true)
  })

  it("doesn’t sell an accepted submission on a channel the app doesn’t know", () => {
    expect(isResaleSubmissionSellable(resaleSubmission({ channel: null }))).toBe(false)
  })

  it("doesn’t sell a rejected, listed or missing submission", () => {
    expect(isResaleSubmissionSellable(resaleSubmission({ state: "REJECTED", channel: null }))).toBe(
      false
    )
    expect(isResaleSubmissionSellable(resaleSubmission({ state: "LISTED" }))).toBe(false)
    expect(isResaleSubmissionSellable(undefined)).toBe(false)
  })
})
