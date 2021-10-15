/* eslint-disable promise/always-return */
import { getUrgencyTag } from "./getUrgencyTag"

describe(getUrgencyTag, () => {
  it("returns the right urgency tag when a sale has a future endDate that is less than 5 days in the future", async () => {
    expect(getUrgencyTag("2020-08-20T02:51:09+00:00")).toEqual("1 minute left")
    expect(getUrgencyTag("2020-08-20T03:59:09+00:00")).toEqual("1 hour left")
    expect(getUrgencyTag("2020-08-20T06:59:09+00:00")).toEqual("4 hours left")
    expect(getUrgencyTag("2020-08-21T02:59:09+00:00")).toEqual("1 day left")
    expect(getUrgencyTag("2020-08-22T02:59:09+00:00")).toEqual("2 days left")
    expect(getUrgencyTag("2020-08-25T02:59:09+00:00")).toEqual("5 days left")
  })

  it("returns null when a sale has a past endDate", async () => {
    expect(getUrgencyTag("2020-07-20T02:50:09+00:00")).toEqual(null)
    expect(getUrgencyTag("2020-08-20T02:50:09+00:00")).toEqual(null)
  })

  it("returns null when a sale has a future endDate that is more than 5 days in the future", async () => {
    expect(getUrgencyTag("2020-09-25T02:50:09+00:00")).toEqual(null)
  })
})
