import { addRoute, addWebViewRoute } from "app/Navigation/utils/addRoute"
import { matchRoute } from "app/system/navigation/utils/matchRoute"
import { replaceParams } from "app/system/navigation/utils/replaceParams"
import { View } from "react-native"

describe("artsy.net routes", () => {
  it("routes to Home", () => {
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

  it("routes to Search", () => {
    expect(matchRoute("/search")).toMatchInlineSnapshot(`
      {
        "module": "Search",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to Inbox", () => {
    expect(matchRoute("/inbox")).toMatchInlineSnapshot(`
      {
        "module": "Inbox",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to MyProfile", () => {
    expect(matchRoute("/my-profile")).toMatchInlineSnapshot(`
      {
        "module": "MyProfile",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to Artist", () => {
    expect(matchRoute("/artist/banksy")).toMatchInlineSnapshot(`
      {
        "module": "Artist",
        "params": {
          "artistID": "banksy",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artist/josef-albers")).toMatchInlineSnapshot(`
      {
        "module": "Artist",
        "params": {
          "artistID": "josef-albers",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artist/more%26more")).toMatchInlineSnapshot(`
      {
        "module": "Artist",
        "params": {
          "artistID": "more%26more",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("https://www.artsy.net/artist/more%26more")).toMatchInlineSnapshot(`
      {
        "module": "Artist",
        "params": {
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
      {
        "module": "Artist",
        "params": {
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
      {
        "module": "Artist",
        "params": {
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
      {
        "module": "Artwork",
        "params": {
          "artworkID": "josef-albers-homage-to-the-square",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artwork/yayoi-kusama-red-pumpkin")).toMatchInlineSnapshot(`
      {
        "module": "Artwork",
        "params": {
          "artworkID": "yayoi-kusama-red-pumpkin",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artwork/more%26more")).toMatchInlineSnapshot(`
      {
        "module": "Artwork",
        "params": {
          "artworkID": "more%26more",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("https://www.artsy.net/artwork/more%26more")).toMatchInlineSnapshot(`
      {
        "module": "Artwork",
        "params": {
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
      {
        "module": "Artwork",
        "params": {
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
      {
        "module": "Artwork",
        "params": {
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
      {
        "module": "Artwork",
        "params": {
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
      {
        "module": "Artist",
        "params": {
          "artistID": "banksy",
          "initialTab": "Insights",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artist/josef-albers/auction-results")).toMatchInlineSnapshot(`
      {
        "module": "Artist",
        "params": {
          "artistID": "josef-albers",
          "initialTab": "Insights",
        },
        "type": "match",
      }
    `)
  })

  it("routes Artist works-for-you to the artist page", () => {
    expect(matchRoute("/artist/banksy/works-for-you")).toMatchInlineSnapshot(`
      {
        "module": "Artist",
        "params": {
          "*": "works-for-you",
          "artistID": "banksy",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artist/josef-albers/works-for-you")).toMatchInlineSnapshot(`
      {
        "module": "Artist",
        "params": {
          "*": "works-for-you",
          "artistID": "josef-albers",
        },
        "type": "match",
      }
    `)
  })

  it("routes profile artist routes to the Artist native view", () => {
    expect(matchRoute("/alpha-137/artist/banksy")).toMatchInlineSnapshot(`
      {
        "module": "Artist",
        "params": {
          "artistID": "banksy",
          "profile_id_ignored": "alpha-137",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/gagosian/artist/josef-albers")).toMatchInlineSnapshot(`
      {
        "module": "Artist",
        "params": {
          "artistID": "josef-albers",
          "profile_id_ignored": "gagosian",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Auction registration", () => {
    expect(matchRoute("/auction-registration/special-auction")).toMatchInlineSnapshot(`
      {
        "module": "AuctionRegistration",
        "params": {
          "saleID": "special-auction",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/auction-registration/other-auction")).toMatchInlineSnapshot(`
      {
        "module": "AuctionRegistration",
        "params": {
          "saleID": "other-auction",
        },
        "type": "match",
      }
    `)
  })

  it("routes to the new Auction view", () => {
    expect(matchRoute("/auction/special-auction")).toMatchInlineSnapshot(`
      {
        "module": "Auction",
        "params": {
          "saleID": "special-auction",
        },
        "type": "match",
      }
    `)
  })

  it("routes to AuctionBidArtwork", () => {
    expect(matchRoute("/auction/special-auction/bid/josef-albers-homage-to-the-square"))
      .toMatchInlineSnapshot(`
      {
        "module": "AuctionBidArtwork",
        "params": {
          "artworkID": "josef-albers-homage-to-the-square",
          "saleID": "special-auction",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/auction/other-auction/bid/yayoi-kusama-red-pumpkin"))
      .toMatchInlineSnapshot(`
      {
        "module": "AuctionBidArtwork",
        "params": {
          "artworkID": "yayoi-kusama-red-pumpkin",
          "saleID": "other-auction",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Gene", () => {
    expect(matchRoute("/gene/blue")).toMatchInlineSnapshot(`
      {
        "module": "Gene",
        "params": {
          "geneID": "blue",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/gene/pop-art")).toMatchInlineSnapshot(`
      {
        "module": "Gene",
        "params": {
          "geneID": "pop-art",
        },
        "type": "match",
      }
    `)
  })

  it("routes to the Show view", () => {
    expect(matchRoute("/show/special-show")).toMatchInlineSnapshot(`
      {
        "module": "Show",
        "params": {
          "showID": "special-show",
        },
        "type": "match",
      }
    `)
  })

  it("routes to ShowMoreInfo", () => {
    expect(matchRoute("/show/blue/info")).toMatchInlineSnapshot(`
      {
        "module": "ShowMoreInfo",
        "params": {
          "showID": "blue",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/show/pop-art/info")).toMatchInlineSnapshot(`
      {
        "module": "ShowMoreInfo",
        "params": {
          "showID": "pop-art",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Inquiry", () => {
    expect(matchRoute("/inquiry/josef-albers-homage-to-the-square")).toMatchInlineSnapshot(`
      {
        "module": "Inquiry",
        "params": {
          "artworkID": "josef-albers-homage-to-the-square",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/inquiry/yayoi-kusama-red-pumpkin")).toMatchInlineSnapshot(`
      {
        "module": "Inquiry",
        "params": {
          "artworkID": "yayoi-kusama-red-pumpkin",
        },
        "type": "match",
      }
    `)
  })

  it("routes to ViewingRooms", () => {
    expect(matchRoute("/viewing-rooms")).toMatchInlineSnapshot(`
      {
        "module": "ViewingRooms",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to ViewingRoom", () => {
    expect(matchRoute("/viewing-room/red")).toMatchInlineSnapshot(`
      {
        "module": "ViewingRoom",
        "params": {
          "viewingRoomID": "red",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/viewing-room/blue")).toMatchInlineSnapshot(`
      {
        "module": "ViewingRoom",
        "params": {
          "viewingRoomID": "blue",
        },
        "type": "match",
      }
    `)
  })

  it("routes to ViewingRoomArtworks", () => {
    expect(matchRoute("/viewing-room/red/artworks")).toMatchInlineSnapshot(`
      {
        "module": "ViewingRoomArtworks",
        "params": {
          "viewingRoomID": "red",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/viewing-room/blue/artworks")).toMatchInlineSnapshot(`
      {
        "module": "ViewingRoomArtworks",
        "params": {
          "viewingRoomID": "blue",
        },
        "type": "match",
      }
    `)
  })

  it("routes to ViewingRoomArtwork", () => {
    expect(matchRoute("/viewing-room/red/josef-albers-homage-to-the-square"))
      .toMatchInlineSnapshot(`
      {
        "module": "ViewingRoomArtwork",
        "params": {
          "artwork_id": "josef-albers-homage-to-the-square",
          "viewingRoomID": "red",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/viewing-room/blue/yayoi-kusama-red-pumpkin")).toMatchInlineSnapshot(`
      {
        "module": "ViewingRoomArtwork",
        "params": {
          "artwork_id": "yayoi-kusama-red-pumpkin",
          "viewingRoomID": "blue",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Feature", () => {
    expect(matchRoute("/feature/barcelona-thing")).toMatchInlineSnapshot(`
      {
        "module": "Feature",
        "params": {
          "slug": "barcelona-thing",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/feature/vanguard-2022")).toMatchInlineSnapshot(`
      {
        "module": "Feature",
        "params": {
          "slug": "vanguard-2022",
        },
        "type": "match",
      }
    `)
  })

  it("routes to ArtistSeries", () => {
    expect(matchRoute("/artist-series/barcelona-thing")).toMatchInlineSnapshot(`
      {
        "module": "ArtistSeries",
        "params": {
          "artistSeriesID": "barcelona-thing",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artist-series/vanguard-2022")).toMatchInlineSnapshot(`
      {
        "module": "ArtistSeries",
        "params": {
          "artistSeriesID": "vanguard-2022",
        },
        "type": "match",
      }
    `)
  })

  it("routes to FullArtistSeriesList", () => {
    expect(matchRoute("/artist/banksy/artist-series")).toMatchInlineSnapshot(`
      {
        "module": "FullArtistSeriesList",
        "params": {
          "artistID": "banksy",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/artist/josef-albers/artist-series")).toMatchInlineSnapshot(`
      {
        "module": "FullArtistSeriesList",
        "params": {
          "artistID": "josef-albers",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Collection", () => {
    expect(matchRoute("/collection/red")).toMatchInlineSnapshot(`
      {
        "module": "Collection",
        "params": {
          "collectionID": "red",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/collection/blue")).toMatchInlineSnapshot(`
      {
        "module": "Collection",
        "params": {
          "collectionID": "blue",
        },
        "type": "match",
      }
    `)
  })

  it("routes to CollectionArtists", () => {
    expect(matchRoute("/collection/red/artists")).toMatchInlineSnapshot(`
      {
        "module": "FullFeaturedArtistList",
        "params": {
          "collectionID": "red",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/collection/blue/artists")).toMatchInlineSnapshot(`
      {
        "module": "FullFeaturedArtistList",
        "params": {
          "collectionID": "blue",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Conversation", () => {
    expect(matchRoute("/conversation/1234")).toMatchInlineSnapshot(`
      {
        "module": "Conversation",
        "params": {
          "conversationID": "1234",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/conversation/3245")).toMatchInlineSnapshot(`
      {
        "module": "Conversation",
        "params": {
          "conversationID": "3245",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Conversation via /user/conversations", () => {
    expect(matchRoute("/user/conversations/1234")).toMatchInlineSnapshot(`
      {
        "module": "Conversation",
        "params": {
          "conversationID": "1234",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/user/conversations/3245")).toMatchInlineSnapshot(`
      {
        "module": "Conversation",
        "params": {
          "conversationID": "3245",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Dev Menu", () => {
    expect(matchRoute("/dev-menu")).toMatchInlineSnapshot(`
      {
        "module": "DevMenu",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to About", () => {
    expect(matchRoute("/about")).toMatchInlineSnapshot(`
      {
        "module": "About",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to Terms and Conditions", () => {
    expect(matchRoute("/terms")).toMatchInlineSnapshot(`
     {
       "module": "ModalWebView",
       "params": {
         "alwaysPresentModally": true,
         "isPresentedModally": true,
         "url": "/terms",
       },
       "type": "match",
     }
    `)
  })

  it("routes to Privacy Policy", () => {
    expect(matchRoute("/privacy")).toMatchInlineSnapshot(`
     {
       "module": "ModalWebView",
       "params": {
         "alwaysPresentModally": true,
         "isPresentedModally": true,
         "url": "/privacy",
       },
       "type": "match",
     }
    `)
  })

  it("routes to Email Preferences", () => {
    expect(matchRoute("/unsubscribe")).toMatchInlineSnapshot(`
      {
        "module": "ReactWebView",
        "params": {
          "isPresentedModally": false,
          "url": "/unsubscribe",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Favorites ", () => {
    expect(matchRoute("/favorites")).toMatchInlineSnapshot(`
      {
        "module": "Favorites",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to MyAccount", () => {
    expect(matchRoute("/my-account")).toMatchInlineSnapshot(`
      {
        "module": "MyAccount",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to MyAccountEditPriceRange", () => {
    expect(matchRoute("/my-account/edit-price-range")).toMatchInlineSnapshot(`
      {
        "module": "MyAccountEditPriceRange",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to MyAccountEditPassword", () => {
    expect(matchRoute("/my-account/edit-password")).toMatchInlineSnapshot(`
      {
        "module": "MyAccountEditPassword",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to MyAccountEditEmail", () => {
    expect(matchRoute("/my-account/edit-email")).toMatchInlineSnapshot(`
      {
        "module": "MyAccountEditEmail",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to MyAccountEditPhone", () => {
    expect(matchRoute("/my-account/edit-phone")).toMatchInlineSnapshot(`
      {
        "module": "MyAccountEditPhone",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to MyProfilePayment", () => {
    expect(matchRoute("/my-profile/payment")).toMatchInlineSnapshot(`
      {
        "module": "MyProfilePayment",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to DarkModeSettings", () => {
    expect(matchRoute("/my-account/dark-mode")).toMatchInlineSnapshot(`
      {
        "module": "DarkModeSettings",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to MyProfilePaymentNewCreditCard", () => {
    expect(matchRoute("/my-profile/payment/new-card")).toMatchInlineSnapshot(`
      {
        "module": "MyProfilePaymentNewCreditCard",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to MyProfilePushNotifications", () => {
    expect(matchRoute("/my-profile/push-notifications")).toMatchInlineSnapshot(`
      {
        "module": "MyProfilePushNotifications",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to LocalDiscovery", () => {
    expect(matchRoute("/local-discovery")).toMatchInlineSnapshot(`
      {
        "module": "LocalDiscovery",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to PrivacyRequest", () => {
    expect(matchRoute("/privacy-request")).toMatchInlineSnapshot(`
      {
        "module": "PrivacyRequest",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to MyCollectionArtwork", () => {
    expect(matchRoute("/my-collection/artwork/123")).toMatchInlineSnapshot(`
      {
        "module": "MyCollectionArtwork",
        "params": {
          "artworkId": "123",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/my-collection/artwork/456")).toMatchInlineSnapshot(`
      {
        "module": "MyCollectionArtwork",
        "params": {
          "artworkId": "456",
        },
        "type": "match",
      }
    `)
  })

  it("routes to MyCollection", () => {
    expect(matchRoute("/my-collection")).toMatchInlineSnapshot(`
      {
        "module": "MyCollection",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes /conditions-of-sale to web view", () => {
    expect(matchRoute("/conditions-of-sale")).toMatchInlineSnapshot(`
      {
        "module": "ModalWebView",
        "params": {
          "alwaysPresentModally": true,
          "isPresentedModally": true,
          "url": "/conditions-of-sale",
        },
        "type": "match",
      }
    `)
  })

  it("routes to ArtworkAttributionClassFAQ", () => {
    expect(matchRoute("/artwork-classifications")).toMatchInlineSnapshot(`
      {
        "module": "ArtworkAttributionClassFAQ",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to Partner", () => {
    expect(matchRoute("/partner/:partnerID")).toMatchInlineSnapshot(`
      {
        "module": "Partner",
        "params": {
          "partnerID": ":partnerID",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/partner/:partnerID/works")).toMatchInlineSnapshot(`
      {
        "module": "Partner",
        "params": {
          "initialTab": "Artworks",
          "partnerID": ":partnerID",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/partner/:partnerID/shows")).toMatchInlineSnapshot(`
      {
        "module": "Partner",
        "params": {
          "initialTab": "Shows",
          "partnerID": ":partnerID",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/partner/:partnerID/artists/:artistID")).toMatchInlineSnapshot(`
      {
        "module": "Artist",
        "params": {
          "artistID": ":artistID",
          "partnerID": ":partnerID",
        },
        "type": "match",
      }
    `)
  })

  it("routes to PartnerLocations", () => {
    expect(matchRoute("/partner-locations/:partnerID")).toMatchInlineSnapshot(`
      {
        "module": "PartnerLocations",
        "params": {
          "partnerID": ":partnerID",
        },
        "type": "match",
      }
    `)
  })

  it("routes to PartnerOfferContainer", () => {
    expect(matchRoute("/partner-offer/:partnerOfferID/checkout")).toMatchInlineSnapshot(`
      {
        "module": "PartnerOfferContainer",
        "params": {
          "partnerOfferID": ":partnerOfferID",
        },
        "type": "match",
      }
    `)
  })

  describe("Fair routing", () => {
    it("routes to Fair", () => {
      expect(matchRoute("/fair/red/artworks")).toMatchInlineSnapshot(`
        {
          "module": "Fair",
          "params": {
            "fairID": "red",
          },
          "type": "match",
        }
      `)
      expect(matchRoute("/fair/blue/artworks")).toMatchInlineSnapshot(`
        {
          "module": "Fair",
          "params": {
            "fairID": "blue",
          },
          "type": "match",
        }
      `)
    })

    it("routes to Fair", () => {
      expect(matchRoute("/fair/red")).toMatchInlineSnapshot(`
        {
          "module": "Fair",
          "params": {
            "fairID": "red",
          },
          "type": "match",
        }
      `)
      expect(matchRoute("/fair/blue")).toMatchInlineSnapshot(`
        {
          "module": "Fair",
          "params": {
            "fairID": "blue",
          },
          "type": "match",
        }
      `)
    })

    it("routes to Fair", () => {
      expect(matchRoute("/fair/red/artists")).toMatchInlineSnapshot(`
        {
          "module": "Fair",
          "params": {
            "fairID": "red",
          },
          "type": "match",
        }
      `)
      expect(matchRoute("/fair/blue/artists")).toMatchInlineSnapshot(`
        {
          "module": "Fair",
          "params": {
            "fairID": "blue",
          },
          "type": "match",
        }
      `)
    })

    it("routes to Fair", () => {
      expect(matchRoute("/fair/red/exhibitors")).toMatchInlineSnapshot(`
        {
          "module": "Fair",
          "params": {
            "fairID": "red",
          },
          "type": "match",
        }
      `)
      expect(matchRoute("/fair/blue/exhibitors")).toMatchInlineSnapshot(`
        {
          "module": "Fair",
          "params": {
            "fairID": "blue",
          },
          "type": "match",
        }
      `)
    })
  })

  it("routes to CitySectionList", () => {
    expect(matchRoute("/city/la/van-nuys")).toMatchInlineSnapshot(`
      {
        "module": "CitySectionList",
        "params": {
          "citySlug": "la",
          "section": "van-nuys",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/city/ny/tribeca")).toMatchInlineSnapshot(`
      {
        "module": "CitySectionList",
        "params": {
          "citySlug": "ny",
          "section": "tribeca",
        },
        "type": "match",
      }
    `)
  })

  it("routes to CityFairList", () => {
    expect(matchRoute("/city-fair/la")).toMatchInlineSnapshot(`
      {
        "module": "CityFairList",
        "params": {
          "citySlug": "la",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/city-fair/ny")).toMatchInlineSnapshot(`
      {
        "module": "CityFairList",
        "params": {
          "citySlug": "ny",
        },
        "type": "match",
      }
    `)
  })

  it("routes to CitySavedList", () => {
    expect(matchRoute("/city-save/la")).toMatchInlineSnapshot(`
      {
        "module": "CitySavedList",
        "params": {
          "citySlug": "la",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/city-save/ny")).toMatchInlineSnapshot(`
      {
        "module": "CitySavedList",
        "params": {
          "citySlug": "ny",
        },
        "type": "match",
      }
    `)
  })

  it("routes to Auctions", () => {
    expect(matchRoute("/auctions")).toMatchInlineSnapshot(`
      {
        "module": "Auctions",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes to WorksForYou", () => {
    expect(matchRoute("/works-for-you")).toMatchInlineSnapshot(`
      {
        "module": "WorksForYou",
        "params": {},
        "type": "match",
      }
    `)
  })

  it("routes /categories to a web view", () => {
    expect(matchRoute("/categories")).toMatchInlineSnapshot(`
      {
        "module": "ReactWebView",
        "params": {
          "isPresentedModally": false,
          "url": "/categories",
        },
        "type": "match",
      }
    `)
  })

  it("routes /privacy to a web view", () => {
    expect(matchRoute("/privacy")).toMatchInlineSnapshot(`
      {
        "module": "ModalWebView",
        "params": {
          "alwaysPresentModally": true,
          "isPresentedModally": true,
          "url": "/privacy",
        },
        "type": "match",
      }
    `)
  })

  it("routes any other single-part paths to VanityURLEntity", () => {
    expect(matchRoute("/gagosian")).toMatchInlineSnapshot(`
      {
        "module": "VanityURLEntity",
        "params": {
          "slug": "gagosian",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/one-hundred-years-of-solitude")).toMatchInlineSnapshot(`
      {
        "module": "VanityURLEntity",
        "params": {
          "slug": "one-hundred-years-of-solitude",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/the-mighty-boosh")).toMatchInlineSnapshot(`
      {
        "module": "VanityURLEntity",
        "params": {
          "slug": "the-mighty-boosh",
        },
        "type": "match",
      }
    `)
  })

  it("routes any other paths to a web view", () => {
    expect(matchRoute("/the/mighty/boosh")).toMatchInlineSnapshot(`
      {
        "module": "ReactWebView",
        "params": {
          "isPresentedModally": false,
          "url": "/the/mighty/boosh",
        },
        "type": "match",
      }
    `)
    expect(matchRoute("/one-hundred/years-of/solitude")).toMatchInlineSnapshot(`
      {
        "module": "ReactWebView",
        "params": {
          "isPresentedModally": false,
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
      {
        "module": "LiveAuction",
        "params": {
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

describe("replaceParams", () => {
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

describe("addWebViewRoute", () => {
  it("returns a route matcher for web views", () => {
    const matcher = addWebViewRoute("/conditions-of-sale")
    expect(matcher.module).toBe("ReactWebView")
    expect(matcher.match(["conditions-of-sale"])).toEqual({
      isPresentedModally: false,
      url: "/conditions-of-sale",
    })
  })

  it("inlines params and wildcards in the original route", () => {
    const matcher = addWebViewRoute("/artist/:artistID/*")
    expect(matcher.match(["artist", "banksy", "auction-results", "8907"])).toEqual({
      isPresentedModally: false,
      url: "/artist/banksy/auction-results/8907",
    })
  })

  it("inlines params in the original order history route", () => {
    const matcher = addWebViewRoute("/user/purchases/:orderID")
    expect(matcher.match(["user", "purchases", "8907"])).toEqual({
      isPresentedModally: false,
      url: "/user/purchases/8907",
    })
  })

  it("inlines params in the original article route", () => {
    const matcher = addWebViewRoute("/article/:orderID")
    expect(matcher.match(["article", "article-article"])).toEqual({
      isPresentedModally: false,
      url: "/article/article-article",
    })
  })
})

describe("addRoute", () => {
  it("returns a route matcher for a route", () => {
    expect(
      addRoute("/home/:id/thing/:slug/other_thing/:slug2", {
        name: "Home",
        Component: View,
      }).match(["home", "mounir", "thing", "blah", "other_thing", "blah2"])
    ).toEqual({ id: "mounir", slug: "blah", slug2: "blah2" })
  })
})
