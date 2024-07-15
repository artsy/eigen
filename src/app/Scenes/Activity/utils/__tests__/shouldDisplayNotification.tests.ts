import { shouldDisplayNotification } from "app/Scenes/Activity/utils/shouldDisplayNotification"

describe("shouldDisplayNotification", () => {
  it("returns true when notification satisfies conditions", () => {
    // artwork based notifications have artworks
    const result = shouldDisplayNotification({
      notificationType: "ARTWORK_ALERT",
      artworks: { totalCount: 1 },
      item: null,
    })
    expect(result).toEqual(true)

    const result2 = shouldDisplayNotification({
      notificationType: "ARTWORK_PUBLISHED",
      artworks: { totalCount: 1 },
      item: null,
    })
    expect(result2).toEqual(true)

    const result3 = shouldDisplayNotification({
      notificationType: "PARTNER_OFFER_CREATED",
      artworks: { totalCount: 1 },
      item: null,
    })
    expect(result3).toEqual(true)

    // viewing room notification has viewing rooms
    const result4 = shouldDisplayNotification({
      notificationType: "VIEWING_ROOM_PUBLISHED",
      artworks: undefined,
      item: { viewingRoomsConnection: { totalCount: 1 } },
    })
    expect(result4).toEqual(true)

    // editorial notification has article
    const result5 = shouldDisplayNotification({
      notificationType: "ARTICLE_FEATURED_ARTIST",
      artworks: undefined,
      item: { article: { internalID: "1" } },
    })
    expect(result5).toEqual(true)
  })

  it("returns false when notification does not satisfy conditions", () => {
    // artwork based notifications have no artworks
    const result = shouldDisplayNotification({
      notificationType: "ARTWORK_ALERT",
      artworks: { totalCount: 0 },
      item: null,
    })
    expect(result).toEqual(false)

    const result2 = shouldDisplayNotification({
      notificationType: "ARTWORK_PUBLISHED",
      artworks: { totalCount: 0 },
      item: null,
    })
    expect(result2).toEqual(false)

    const result3 = shouldDisplayNotification({
      notificationType: "PARTNER_OFFER_CREATED",
      artworks: { totalCount: 0 },
      item: null,
    })
    expect(result3).toEqual(false)

    // viewing room notification has no viewing rooms
    const result4 = shouldDisplayNotification({
      notificationType: "VIEWING_ROOM_PUBLISHED",
      artworks: undefined,
      item: { viewingRoomsConnection: { totalCount: 0 } },
    })
    expect(result4).toEqual(false)

    // editorial notification has no article
    const result5 = shouldDisplayNotification({
      notificationType: "ARTICLE_FEATURED_ARTIST",
      artworks: undefined,
      item: {},
    })
    expect(result5).toEqual(false)
  })
})
