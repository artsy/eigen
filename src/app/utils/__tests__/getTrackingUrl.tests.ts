import { getTrackingUrl } from "app/utils/getTrackingUrl"

describe(getTrackingUrl, () => {
  let mockOrderLineItem: any

  beforeEach(() => {
    mockOrderLineItem = {
      shipment: {
        trackingNumber: null,
        trackingUrl: null,
      },
      fulfillments: {
        edges: [
          {
            node: {
              trackingId: "123456789",
            },
          },
        ],
      },
    }
  })

  it("returns correct tracking url if used trackingId", () => {
    expect(getTrackingUrl(mockOrderLineItem)).toEqual("https://google.com/search?q=123456789")
  })

  it("returns undefined if no tracking information", () => {
    mockOrderLineItem = {
      ...mockOrderLineItem,
      fulfillments: {
        edges: [
          {
            node: {
              trackingId: null,
            },
          },
        ],
      },
    }

    expect(getTrackingUrl(mockOrderLineItem)).toEqual(undefined)
  })

  it("returns correct tracking url if used trackingNumber", () => {
    mockOrderLineItem = {
      shipment: {
        trackingNumber: "123456789",
        trackingUrl: null,
      },
      fulfillments: {
        edges: [
          {
            node: {
              trackingId: null,
            },
          },
        ],
      },
    }

    expect(getTrackingUrl(mockOrderLineItem)).toEqual("https://google.com/search?q=123456789")
  })

  it("returns correct tracking url if used trackingUrl", () => {
    mockOrderLineItem = {
      shipment: {
        trackingNumber: null,
        trackingUrl:
          "https://www.ups.com/track?loc=en_us&tracknum=1zw475770393992448&Requester=NS/trackdetails",
      },
      fulfillments: {
        edges: [
          {
            node: {
              trackingId: null,
            },
          },
        ],
      },
    }

    expect(getTrackingUrl(mockOrderLineItem)).toEqual(
      "https://www.ups.com/track?loc=en_us&tracknum=1zw475770393992448&Requester=NS/trackdetails"
    )
  })
})
