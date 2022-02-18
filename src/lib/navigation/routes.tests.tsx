import { addRoute, addWebViewRoute, matchRoute, replaceParams } from "lib/navigation/routes"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"

describe("artsy.net routes", () => {
  it(`routes to Home`, () => {
    const expected = {
      type: "match",
      module: "Home",
      params: {},
    }
    expect(matchRoute("/")).toEqual(expected)
    expect(matchRoute("")).toEqual(expected)
    expect(matchRoute("//")).toEqual(expected)
    expect(matchRoute("https://www.artsy.net/")).toEqual(expected)
    expect(matchRoute("https://www.artsy.net/")).toEqual(expected)
    expect(matchRoute("https://staging.artsy.net/")).toEqual(expected)
  })

  it("routes to Sales", () => {
    expect(matchRoute("/sales")).toMatchInlineSnapshot(`
      Object {
        "module": "Sales",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to Search", () => {
    expect(matchRoute("/search")).toMatchInlineSnapshot(`
      Object {
        "module": "Search",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to Inbox", () => {
    expect(matchRoute("/inbox")).toMatchInlineSnapshot(`
      Object {
        "module": "Inbox",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to MyProfile", () => {
    expect(matchRoute("/my-profile")).toMatchInlineSnapshot(`
      Object {
        "module": "MyProfile",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to Artist", () => {
    expect(matchRoute("/artist/banksy")).toMatchInlineSnapshot(`
      Object {
        "module": "Artist",
        "params": Object {
          "artistID": "banksy",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artist/josef-albers")).toMatchInlineSnapshot(`
      Object {
        "module": "Artist",
        "params": Object {
          "artistID": "josef-albers",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artist/more%26more")).toMatchInlineSnapshot(`
      Object {
        "module": "Artist",
        "params": Object {
          "artistID": "more%26more",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("https://www.artsy.net/artist/more%26more")).toMatchInlineSnapshot(`
      Object {
        "module": "Artist",
        "params": Object {
          "artistID": "more&more",
        },
        "type": "match",
      }
    `)
    expect(
      matchRoute(
        "artist/josef-albers?utm_medium=social&utm_source=instagram-story&utm_campaign=dp."
      )
    ).toMatchInlineSnapshot(`
      Object {
        "module": "Artist",
        "params": Object {
          "artistID": "josef-albers",
          "utm_campaign": "dp.",
          "utm_medium": "social",
          "utm_source": "instagram-story",
        },
        "type": "match",
      }
    `)
    expect(
      matchRoute(
        "https://www.artsy.net/artist/josef-albers%3Futm_medium%3Dsocial%26utm_source%3Dinstagram-story%26utm_campaign%3Ddp."
      )
    ).toMatchInlineSnapshot(`
      Object {
        "module": "Artist",
        "params": Object {
          "artistID": "josef-albers",
          "utm_campaign": "dp.",
          "utm_medium": "social",
          "utm_source": "instagram-story",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Artwork", () => {
    expect(matchRoute("/artwork/josef-albers-homage-to-the-square")).toMatchInlineSnapshot(`
      Object {
        "module": "Artwork",
        "params": Object {
          "artworkID": "josef-albers-homage-to-the-square",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artwork/yayoi-kusama-red-pumpkin")).toMatchInlineSnapshot(`
      Object {
        "module": "Artwork",
        "params": Object {
          "artworkID": "yayoi-kusama-red-pumpkin",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artwork/more%26more")).toMatchInlineSnapshot(`
      Object {
        "module": "Artwork",
        "params": Object {
          "artworkID": "more%26more",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("https://www.artsy.net/artwork/more%26more")).toMatchInlineSnapshot(`
      Object {
        "module": "Artwork",
        "params": Object {
          "artworkID": "more&more",
        },
        "type": "match",
      }
    `)
    expect(
      matchRoute(
        encodeURIComponent(encodeURIComponent("https://www.artsy.net/artwork/more%26more"))
      )
    ).toMatchInlineSnapshot(`
      Object {
        "module": "Artwork",
        "params": Object {
          "artworkID": "more&more",
        },
        "type": "match",
      }
    `)
    expect(
      matchRoute(
        "/artwork/yayoi-kusama-red-pumpkin?utm_medium=social&utm_source=instagram-story&utm_campaign=dp."
      )
    ).toMatchInlineSnapshot(`
      Object {
        "module": "Artwork",
        "params": Object {
          "artworkID": "yayoi-kusama-red-pumpkin",
          "utm_campaign": "dp.",
          "utm_medium": "social",
          "utm_source": "instagram-story",
        },
        "type": "match",
      }
    `)
    expect(
      matchRoute(
        "https://www.artsy.net/artwork/yayoi-kusama-red-pumpkin%3Futm_medium%3Dsocial%26utm_source%3Dinstagram-story%26utm_campaign%3Ddp."
      )
    ).toMatchInlineSnapshot(`
      Object {
        "module": "Artwork",
        "params": Object {
          "artworkID": "yayoi-kusama-red-pumpkin",
          "utm_campaign": "dp.",
          "utm_medium": "social",
          "utm_source": "instagram-story",
        },
        "type": "match",
      }
    `)
  })

  it("routes Artist auction results to artist insights", () => {
    expect(matchRoute("/artist/banksy/auction-results")).toMatchInlineSnapshot(`
      Object {
        "module": "Artist",
        "params": Object {
          "artistID": "banksy",
          "initialTab": "Insights",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artist/josef-albers/auction-results")).toMatchInlineSnapshot(`
      Object {
        "module": "Artist",
        "params": Object {
          "artistID": "josef-albers",
          "initialTab": "Insights",
        },
        "type": "match",
      }
    `)
  })

  it("routes Artist works-for-you to the artist page", () => {
    expect(matchRoute("/artist/banksy/works-for-you")).toMatchInlineSnapshot(`
      Object {
        "module": "Artist",
        "params": Object {
          "*": "works-for-you",
          "artistID": "banksy",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artist/josef-albers/works-for-you")).toMatchInlineSnapshot(`
      Object {
        "module": "Artist",
        "params": Object {
          "*": "works-for-you",
          "artistID": "josef-albers",
        },
        "type": "match",
      }
    `)
  })

  it("routes profile artist routes to the Artist native view", () => {
    expect(matchRoute("/alpha-137/artist/banksy")).toMatchInlineSnapshot(`
      Object {
        "module": "Artist",
        "params": Object {
          "artistID": "banksy",
          "profile_id_ignored": "alpha-137",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/gagosian/artist/josef-albers")).toMatchInlineSnapshot(`
      Object {
        "module": "Artist",
        "params": Object {
          "artistID": "josef-albers",
          "profile_id_ignored": "gagosian",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Auction registration", () => {
    expect(matchRoute("/auction-registration/special-auction")).toMatchInlineSnapshot(`
      Object {
        "module": "AuctionRegistration",
        "params": Object {
          "saleID": "special-auction",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/auction-registration/other-auction")).toMatchInlineSnapshot(`
      Object {
        "module": "AuctionRegistration",
        "params": Object {
          "saleID": "other-auction",
        },
        "type": "match",
      }
    `)
  })

  it("routes to the old Auction view when the AROptionsNewSalePage option is false", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsNewSalePage: false })
    expect(matchRoute("/auction/special-auction")).toMatchInlineSnapshot(`
      Object {
        "module": "Auction",
        "params": Object {
          "id": "special-auction",
        },
        "type": "match",
      }
    `)
  })

  it("routes to the new Auction view when the AROptionsNewSalePage option is true", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsNewSalePage: true })
    expect(matchRoute("/auction/special-auction")).toMatchInlineSnapshot(`
      Object {
        "module": "Auction2",
        "params": Object {
          "saleID": "special-auction",
        },
        "type": "match",
      }
    `)
  })

  it("routes to AuctionBidArtwork", () => {
    expect(matchRoute("/auction/special-auction/bid/josef-albers-homage-to-the-square"))
      .toMatchInlineSnapshot(`
      Object {
        "module": "AuctionBidArtwork",
        "params": Object {
          "artworkID": "josef-albers-homage-to-the-square",
          "saleID": "special-auction",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/auction/other-auction/bid/yayoi-kusama-red-pumpkin"))
      .toMatchInlineSnapshot(`
      Object {
        "module": "AuctionBidArtwork",
        "params": Object {
          "artworkID": "yayoi-kusama-red-pumpkin",
          "saleID": "other-auction",
        },
        "type": "match",
      }
    `)
  })

  it("routes to the old Auction view when the AROptionsNewSalePage option is false", () => {
    expect(matchRoute("/auction-faq")).toMatchInlineSnapshot(`
      Object {
        "module": "AuctionFAQ",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to Gene", () => {
    expect(matchRoute("/gene/blue")).toMatchInlineSnapshot(`
      Object {
        "module": "Gene",
        "params": Object {
          "geneID": "blue",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/gene/pop-art")).toMatchInlineSnapshot(`
      Object {
        "module": "Gene",
        "params": Object {
          "geneID": "pop-art",
        },
        "type": "match",
      }
    `)
  })

  it("routes to the Show view", () => {
    expect(matchRoute("/show/special-show")).toMatchInlineSnapshot(`
        Object {
          "module": "Show",
          "params": Object {
            "showID": "special-show",
          },
          "type": "match",
        }
      `)
  })

  it("routes to ShowMoreInfo", () => {
    expect(matchRoute("/show/blue/info")).toMatchInlineSnapshot(`
      Object {
        "module": "ShowMoreInfo",
        "params": Object {
          "showID": "blue",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/show/pop-art/info")).toMatchInlineSnapshot(`
      Object {
        "module": "ShowMoreInfo",
        "params": Object {
          "showID": "pop-art",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Inquiry", () => {
    expect(matchRoute("/inquiry/josef-albers-homage-to-the-square")).toMatchInlineSnapshot(`
      Object {
        "module": "Inquiry",
        "params": Object {
          "artworkID": "josef-albers-homage-to-the-square",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/inquiry/yayoi-kusama-red-pumpkin")).toMatchInlineSnapshot(`
      Object {
        "module": "Inquiry",
        "params": Object {
          "artworkID": "yayoi-kusama-red-pumpkin",
        },
        "type": "match",
      }
    `)
  })

  it("routes to ViewingRooms", () => {
    expect(matchRoute("/viewing-rooms")).toMatchInlineSnapshot(`
      Object {
        "module": "ViewingRooms",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to ViewingRoom", () => {
    expect(matchRoute("/viewing-room/red")).toMatchInlineSnapshot(`
      Object {
        "module": "ViewingRoom",
        "params": Object {
          "viewing_room_id": "red",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/viewing-room/blue")).toMatchInlineSnapshot(`
      Object {
        "module": "ViewingRoom",
        "params": Object {
          "viewing_room_id": "blue",
        },
        "type": "match",
      }
    `)
  })

  it("routes to ViewingRoomArtworks", () => {
    expect(matchRoute("/viewing-room/red/artworks")).toMatchInlineSnapshot(`
      Object {
        "module": "ViewingRoomArtworks",
        "params": Object {
          "viewing_room_id": "red",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/viewing-room/blue/artworks")).toMatchInlineSnapshot(`
      Object {
        "module": "ViewingRoomArtworks",
        "params": Object {
          "viewing_room_id": "blue",
        },
        "type": "match",
      }
    `)
  })

  it("routes to ViewingRoomArtwork", () => {
    expect(matchRoute("/viewing-room/red/josef-albers-homage-to-the-square"))
      .toMatchInlineSnapshot(`
      Object {
        "module": "ViewingRoomArtwork",
        "params": Object {
          "artwork_id": "josef-albers-homage-to-the-square",
          "viewing_room_id": "red",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/viewing-room/blue/yayoi-kusama-red-pumpkin")).toMatchInlineSnapshot(`
      Object {
        "module": "ViewingRoomArtwork",
        "params": Object {
          "artwork_id": "yayoi-kusama-red-pumpkin",
          "viewing_room_id": "blue",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Feature", () => {
    expect(matchRoute("/feature/barcelona-thing")).toMatchInlineSnapshot(`
      Object {
        "module": "Feature",
        "params": Object {
          "slug": "barcelona-thing",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/feature/vanguard-2022")).toMatchInlineSnapshot(`
      Object {
        "module": "Feature",
        "params": Object {
          "slug": "vanguard-2022",
        },
        "type": "match",
      }
    `)
  })

  it("routes to ArtistSeries", () => {
    expect(matchRoute("/artist-series/barcelona-thing")).toMatchInlineSnapshot(`
      Object {
        "module": "ArtistSeries",
        "params": Object {
          "artistSeriesID": "barcelona-thing",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artist-series/vanguard-2022")).toMatchInlineSnapshot(`
      Object {
        "module": "ArtistSeries",
        "params": Object {
          "artistSeriesID": "vanguard-2022",
        },
        "type": "match",
      }
    `)
  })

  it("routes to FullArtistSeriesList", () => {
    expect(matchRoute("/artist/banksy/artist-series")).toMatchInlineSnapshot(`
      Object {
        "module": "FullArtistSeriesList",
        "params": Object {
          "artistID": "banksy",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artist/josef-albers/artist-series")).toMatchInlineSnapshot(`
      Object {
        "module": "FullArtistSeriesList",
        "params": Object {
          "artistID": "josef-albers",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Collection", () => {
    expect(matchRoute("/collection/red")).toMatchInlineSnapshot(`
      Object {
        "module": "Collection",
        "params": Object {
          "collectionID": "red",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/collection/blue")).toMatchInlineSnapshot(`
      Object {
        "module": "Collection",
        "params": Object {
          "collectionID": "blue",
        },
        "type": "match",
      }
    `)
  })

  it("routes to CollectionArtists", () => {
    expect(matchRoute("/collection/red/artists")).toMatchInlineSnapshot(`
      Object {
        "module": "FullFeaturedArtistList",
        "params": Object {
          "collectionID": "red",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/collection/blue/artists")).toMatchInlineSnapshot(`
      Object {
        "module": "FullFeaturedArtistList",
        "params": Object {
          "collectionID": "blue",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Conversation", () => {
    expect(matchRoute("/conversation/1234")).toMatchInlineSnapshot(`
      Object {
        "module": "Conversation",
        "params": Object {
          "conversationID": "1234",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/conversation/3245")).toMatchInlineSnapshot(`
      Object {
        "module": "Conversation",
        "params": Object {
          "conversationID": "3245",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Conversation via /user/conversations", () => {
    expect(matchRoute("/user/conversations/1234")).toMatchInlineSnapshot(`
      Object {
        "module": "Conversation",
        "params": Object {
          "conversationID": "1234",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/user/conversations/3245")).toMatchInlineSnapshot(`
      Object {
        "module": "Conversation",
        "params": Object {
          "conversationID": "3245",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Admin", () => {
    expect(matchRoute("/admin")).toMatchInlineSnapshot(`
      Object {
        "module": "Admin",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to About", () => {
    expect(matchRoute("/about")).toMatchInlineSnapshot(`
      Object {
        "module": "About",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to Terms and Conditions", () => {
    expect(matchRoute("/terms")).toMatchInlineSnapshot(`
      Object {
        "module": "ReactWebView",
        "params": Object {
          "url": "/terms",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Privacy Policy", () => {
    expect(matchRoute("/privacy")).toMatchInlineSnapshot(`
      Object {
        "module": "ReactWebView",
        "params": Object {
          "url": "/privacy",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Email Preferences", () => {
    expect(matchRoute("/unsubscribe")).toMatchInlineSnapshot(`
      Object {
        "module": "ReactWebView",
        "params": Object {
          "url": "/unsubscribe",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Favorites", () => {
    expect(matchRoute("/favorites")).toMatchInlineSnapshot(`
      Object {
        "module": "Favorites",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to MyAccount", () => {
    expect(matchRoute("/my-account")).toMatchInlineSnapshot(`
      Object {
        "module": "MyAccount",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to MyAccountEditName", () => {
    expect(matchRoute("/my-account/edit-name")).toMatchInlineSnapshot(`
      Object {
        "module": "MyAccountEditName",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to MyAccountEditPassword", () => {
    expect(matchRoute("/my-account/edit-password")).toMatchInlineSnapshot(`
      Object {
        "module": "MyAccountEditPassword",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to MyAccountEditEmail", () => {
    expect(matchRoute("/my-account/edit-email")).toMatchInlineSnapshot(`
      Object {
        "module": "MyAccountEditEmail",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to MyAccountEditPhone", () => {
    expect(matchRoute("/my-account/edit-phone")).toMatchInlineSnapshot(`
      Object {
        "module": "MyAccountEditPhone",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to MyProfilePayment", () => {
    expect(matchRoute("/my-profile/payment")).toMatchInlineSnapshot(`
      Object {
        "module": "MyProfilePayment",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to DarkModeSettings", () => {
    expect(matchRoute("/settings/dark-mode")).toMatchInlineSnapshot(`
      Object {
        "module": "DarkModeSettings",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to MyProfilePaymentNewCreditCard", () => {
    expect(matchRoute("/my-profile/payment/new-card")).toMatchInlineSnapshot(`
      Object {
        "module": "MyProfilePaymentNewCreditCard",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to MyProfilePushNotifications", () => {
    expect(matchRoute("/my-profile/push-notifications")).toMatchInlineSnapshot(`
      Object {
        "module": "MyProfilePushNotifications",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to LocalDiscovery", () => {
    expect(matchRoute("/local-discovery")).toMatchInlineSnapshot(`
      Object {
        "module": "LocalDiscovery",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to PrivacyRequest", () => {
    expect(matchRoute("/privacy-request")).toMatchInlineSnapshot(`
      Object {
        "module": "PrivacyRequest",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to MyCollectionArtwork", () => {
    expect(matchRoute("/my-collection/artwork/123")).toMatchInlineSnapshot(`
      Object {
        "module": "MyCollectionArtwork",
        "params": Object {
          "artworkSlug": "123",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/my-collection/artwork/456")).toMatchInlineSnapshot(`
      Object {
        "module": "MyCollectionArtwork",
        "params": Object {
          "artworkSlug": "456",
        },
        "type": "match",
      }
    `)
  })

  it("routes to MyCollectionArtworkFullDetails", () => {
    expect(matchRoute("/my-collection/artwork-details/123")).toMatchInlineSnapshot(`
      Object {
        "module": "MyCollectionArtworkFullDetails",
        "params": Object {
          "artworkSlug": "123",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/my-collection/artwork-details/456")).toMatchInlineSnapshot(`
      Object {
        "module": "MyCollectionArtworkFullDetails",
        "params": Object {
          "artworkSlug": "456",
        },
        "type": "match",
      }
    `)
  })

  it("routes to MyCollection", () => {
    expect(matchRoute("/my-collection")).toMatchInlineSnapshot(`
      Object {
        "module": "MyCollection",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to ConsignmentsSubmissionForm", () => {
    expect(matchRoute("/consign/submission")).toMatchInlineSnapshot(`
      Object {
        "module": "ConsignmentsSubmissionForm",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to Sales", () => {
    expect(matchRoute("/collections/my-collection/marketing-landing")).toMatchInlineSnapshot(`
      Object {
        "module": "SalesNotRootTabView",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes /conditions-of-sale to web view", () => {
    expect(matchRoute("/conditions-of-sale")).toMatchInlineSnapshot(`
      Object {
        "module": "ReactWebView",
        "params": Object {
          "url": "/conditions-of-sale",
        },
        "type": "match",
      }
    `)
  })

  it("routes to ArtworkAttributionClassFAQ", () => {
    expect(matchRoute("/artwork-classifications")).toMatchInlineSnapshot(`
      Object {
        "module": "ArtworkAttributionClassFAQ",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to Partner", () => {
    expect(matchRoute("/partner/:partnerID")).toMatchInlineSnapshot(`
      Object {
        "module": "Partner",
        "params": Object {
          "partnerID": ":partnerID",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/partner/:partnerID/works")).toMatchInlineSnapshot(`
      Object {
        "module": "Partner",
        "params": Object {
          "partnerID": ":partnerID",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/partner/:partnerID/artists/:artistID")).toMatchInlineSnapshot(`
      Object {
        "module": "Partner",
        "params": Object {
          "artistID": ":artistID",
          "partnerID": ":partnerID",
        },
        "type": "match",
      }
    `)
  })

  it("routes to PartnerLocations", () => {
    expect(matchRoute("/partner-locations/:partnerID")).toMatchInlineSnapshot(`
      Object {
        "module": "PartnerLocations",
        "params": Object {
          "partnerID": ":partnerID",
        },
        "type": "match",
      }
    `)
  })

  describe("Fair routing", () => {
    it("routes to Fair", () => {
      expect(matchRoute("/fair/red/artworks")).toMatchInlineSnapshot(`
              Object {
                "module": "Fair",
                "params": Object {
                  "fairID": "red",
                },
                "type": "match",
              }
          `)
      expect(matchRoute("/fair/blue/artworks")).toMatchInlineSnapshot(`
              Object {
                "module": "Fair",
                "params": Object {
                  "fairID": "blue",
                },
                "type": "match",
              }
          `)
    })

    it("routes to Fair", () => {
      expect(matchRoute("/fair/red")).toMatchInlineSnapshot(`
              Object {
                "module": "Fair",
                "params": Object {
                  "fairID": "red",
                },
                "type": "match",
              }
          `)
      expect(matchRoute("/fair/blue")).toMatchInlineSnapshot(`
              Object {
                "module": "Fair",
                "params": Object {
                  "fairID": "blue",
                },
                "type": "match",
              }
          `)
    })

    it("routes to Fair", () => {
      expect(matchRoute("/fair/red/artists")).toMatchInlineSnapshot(`
              Object {
                "module": "Fair",
                "params": Object {
                  "fairID": "red",
                },
                "type": "match",
              }
          `)
      expect(matchRoute("/fair/blue/artists")).toMatchInlineSnapshot(`
              Object {
                "module": "Fair",
                "params": Object {
                  "fairID": "blue",
                },
                "type": "match",
              }
          `)
    })

    it("routes to Fair", () => {
      expect(matchRoute("/fair/red/exhibitors")).toMatchInlineSnapshot(`
              Object {
                "module": "Fair",
                "params": Object {
                  "fairID": "red",
                },
                "type": "match",
              }
          `)
      expect(matchRoute("/fair/blue/exhibitors")).toMatchInlineSnapshot(`
              Object {
                "module": "Fair",
                "params": Object {
                  "fairID": "blue",
                },
                "type": "match",
              }
          `)
    })

    it("routes to FairBMWArtActivation", () => {
      expect(matchRoute("/fair/red/bmw-sponsored-content")).toMatchInlineSnapshot(`
              Object {
                "module": "FairBMWArtActivation",
                "params": Object {
                  "fairID": "red",
                },
                "type": "match",
              }
          `)
      expect(matchRoute("/fair/blue/bmw-sponsored-content")).toMatchInlineSnapshot(`
              Object {
                "module": "FairBMWArtActivation",
                "params": Object {
                  "fairID": "blue",
                },
                "type": "match",
              }
          `)
    })
  })

  it("routes to CitySectionList", () => {
    expect(matchRoute("/city/la/van-nuys")).toMatchInlineSnapshot(`
      Object {
        "module": "CitySectionList",
        "params": Object {
          "citySlug": "la",
          "section": "van-nuys",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/city/ny/tribeca")).toMatchInlineSnapshot(`
      Object {
        "module": "CitySectionList",
        "params": Object {
          "citySlug": "ny",
          "section": "tribeca",
        },
        "type": "match",
      }
    `)
  })

  it("routes to CityFairList", () => {
    expect(matchRoute("/city-fair/la")).toMatchInlineSnapshot(`
      Object {
        "module": "CityFairList",
        "params": Object {
          "citySlug": "la",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/city-fair/ny")).toMatchInlineSnapshot(`
      Object {
        "module": "CityFairList",
        "params": Object {
          "citySlug": "ny",
        },
        "type": "match",
      }
    `)
  })

  it("routes to CitySavedList", () => {
    expect(matchRoute("/city-save/la")).toMatchInlineSnapshot(`
      Object {
        "module": "CitySavedList",
        "params": Object {
          "citySlug": "la",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/city-save/ny")).toMatchInlineSnapshot(`
      Object {
        "module": "CitySavedList",
        "params": Object {
          "citySlug": "ny",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Auctions", () => {
    expect(matchRoute("/auctions")).toMatchInlineSnapshot(`
      Object {
        "module": "Auctions",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes to WorksForYou", () => {
    expect(matchRoute("/works-for-you")).toMatchInlineSnapshot(`
      Object {
        "module": "WorksForYou",
        "params": Object {},
        "type": "match",
      }
    `)
  })

  it("routes /categories to a web view", () => {
    expect(matchRoute("/categories")).toMatchInlineSnapshot(`
      Object {
        "module": "ReactWebView",
        "params": Object {
          "url": "/categories",
        },
        "type": "match",
      }
    `)
  })

  it("routes /privacy to a web view", () => {
    expect(matchRoute("/privacy")).toMatchInlineSnapshot(`
      Object {
        "module": "ReactWebView",
        "params": Object {
          "url": "/privacy",
        },
        "type": "match",
      }
    `)
  })

  it("routes to CityBMWList", () => {
    expect(matchRoute("/city-bmw-list/la")).toMatchInlineSnapshot(`
      Object {
        "module": "CityBMWList",
        "params": Object {
          "citySlug": "la",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/city-bmw-list/ny")).toMatchInlineSnapshot(`
      Object {
        "module": "CityBMWList",
        "params": Object {
          "citySlug": "ny",
        },
        "type": "match",
      }
    `)
  })

  it("routes any other single-part paths to VanityURLEntity", () => {
    expect(matchRoute("/gagosian")).toMatchInlineSnapshot(`
      Object {
        "module": "VanityURLEntity",
        "params": Object {
          "slug": "gagosian",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/one-hundred-years-of-solitude")).toMatchInlineSnapshot(`
      Object {
        "module": "VanityURLEntity",
        "params": Object {
          "slug": "one-hundred-years-of-solitude",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/the-mighty-boosh")).toMatchInlineSnapshot(`
      Object {
        "module": "VanityURLEntity",
        "params": Object {
          "slug": "the-mighty-boosh",
        },
        "type": "match",
      }
    `)
  })

  it("routes any other paths to a web view", () => {
    expect(matchRoute("/the/mighty/boosh")).toMatchInlineSnapshot(`
      Object {
        "module": "ReactWebView",
        "params": Object {
          "url": "/the/mighty/boosh",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/one-hundred/years-of/solitude")).toMatchInlineSnapshot(`
      Object {
        "module": "ReactWebView",
        "params": Object {
          "url": "/one-hundred/years-of/solitude",
        },
        "type": "match",
      }
    `)
  })
})

describe("live auction routes", () => {
  it("are passed through", () => {
    expect(matchRoute("https://live.artsy.net/nice-auction")).toMatchInlineSnapshot(`
      Object {
        "module": "LiveAuction",
        "params": Object {
          "slug": "nice-auction",
        },
        "type": "match",
      }
    `)
  })
})

describe("other domains", () => {
  it("open in a browser", () => {
    expect(matchRoute("https://google.com")).toEqual({
      type: "external_url",
      url: "https://google.com",
    })
  })
})

describe(replaceParams, () => {
  it("replaces the params in a url with params from an object", () => {
    expect(replaceParams("/artist/:id", { id: "banksy" })).toBe("/artist/banksy")
    expect(
      replaceParams("/bid/:saleID/:artworkID", {
        saleID: "christies",
        artworkID: "keith-haring-dog",
      })
    ).toBe("/bid/christies/keith-haring-dog")
    expect(replaceParams("/artist/:artistID/auction-results", { artistID: "josef-albers" })).toBe(
      "/artist/josef-albers/auction-results"
    )
  })

  it("works with wildcards", () => {
    expect(replaceParams("/artist/:id/*", { id: "banksy", "*": "auction-results/78923" })).toBe(
      "/artist/banksy/auction-results/78923"
    )
  })
})

describe(addWebViewRoute, () => {
  it("returns a route matcher for web views", () => {
    const matcher = addWebViewRoute("/conditions-of-sale")
    expect(matcher.module).toBe("ReactWebView")
    expect(matcher.match(["conditions-of-sale"])).toEqual({ url: "/conditions-of-sale" })
  })

  it("returns react web view when the feature flag is on", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsUseReactNativeWebView: true })
    const matcher = addWebViewRoute("/conditions-of-sale")
    expect(matcher.module).toBe("ReactWebView")
  })

  it("inlines params and wildcards in the original route", () => {
    const matcher = addWebViewRoute("/artist/:artistID/*")
    expect(matcher.match(["artist", "banksy", "auction-results", "8907"])).toEqual({
      url: "/artist/banksy/auction-results/8907",
    })
  })

  it("inlines params in the original order history route", () => {
    const matcher = addWebViewRoute("/user/purchases/:orderID")
    expect(matcher.match(["user", "purchases", "8907"])).toEqual({
      url: "/user/purchases/8907",
    })
  })

  it("inlines params in the original article route", () => {
    const matcher = addWebViewRoute("/article/:orderID")
    expect(matcher.match(["article", "article-article"])).toEqual({
      url: "/article/article-article",
    })
  })
})

describe(addRoute, () => {
  it("returns a route matcher for a route", () => {
    expect(
      addRoute("/home/:id/thing/:slug/other_thing/:slug2", "Home").match([
        "home",
        "mounir",
        "thing",
        "blah",
        "other_thing",
        "blah2",
      ])
    ).toEqual({ id: "mounir", slug: "blah", slug2: "blah2" })
  })
})
