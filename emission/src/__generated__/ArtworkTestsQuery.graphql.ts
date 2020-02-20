/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkTestsQueryVariables = {};
export type ArtworkTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"Artwork_artworkAboveTheFold">;
    } | null;
};
export type ArtworkTestsQuery = {
    readonly response: ArtworkTestsQueryResponse;
    readonly variables: ArtworkTestsQueryVariables;
};



/*
query ArtworkTestsQuery {
  artwork(id: "doesn't matter") {
    ...Artwork_artworkAboveTheFold
    id
  }
}

fragment Artwork_artworkAboveTheFold on Artwork {
  ...ArtworkHeader_artwork
  ...CommercialInformation_artwork
  slug
  internalID
  id
  is_acquireable: isAcquireable
  is_offerable: isOfferable
  is_biddable: isBiddable
  is_inquireable: isInquireable
  availability
}

fragment ArtworkHeader_artwork on Artwork {
  ...ArtworkActions_artwork
  ...ArtworkTombstone_artwork
  images {
    ...ImageCarousel_images
  }
}

fragment CommercialInformation_artwork on Artwork {
  isAcquireable
  isOfferable
  isInquireable
  isInAuction
  availability
  saleMessage
  isForSale
  artists {
    isConsignable
    id
  }
  editionSets {
    id
  }
  sale {
    isClosed
    isAuction
    isLiveOpen
    isPreview
    liveStartAt
    endAt
    startAt
    id
  }
  ...CommercialButtons_artwork
  ...CommercialPartnerInformation_artwork
  ...CommercialEditionSetInformation_artwork
  ...ArtworkExtraLinks_artwork
  ...AuctionPrice_artwork
}

fragment CommercialButtons_artwork on Artwork {
  slug
  isAcquireable
  isOfferable
  isInquireable
  isInAuction
  isBuyNowable
  isForSale
  editionSets {
    id
  }
  sale {
    isClosed
    id
  }
  ...BuyNowButton_artwork
  ...BidButton_artwork
  ...MakeOfferButton_artwork
}

fragment CommercialPartnerInformation_artwork on Artwork {
  availability
  isAcquireable
  isForSale
  isOfferable
  shippingOrigin
  shippingInfo
  priceIncludesTaxDisplay
  partner {
    name
    id
  }
}

fragment CommercialEditionSetInformation_artwork on Artwork {
  editionSets {
    id
    internalID
    saleMessage
    editionOf
    dimensions {
      in
      cm
    }
  }
  ...CommercialPartnerInformation_artwork
}

fragment ArtworkExtraLinks_artwork on Artwork {
  isAcquireable
  isInAuction
  isOfferable
  title
  isForSale
  sale {
    isClosed
    isBenefit
    partner {
      name
      id
    }
    id
  }
  artists {
    isConsignable
    name
    id
  }
  artist {
    name
    id
  }
}

fragment AuctionPrice_artwork on Artwork {
  sale {
    internalID
    isWithBuyersPremium
    isClosed
    isLiveOpen
    id
  }
  saleArtwork {
    reserveMessage
    currentBid {
      display
    }
    counts {
      bidderPositions
    }
    id
  }
  myLotStanding(live: true) {
    activeBid {
      isWinning
      id
    }
    mostRecentBid {
      maxBid {
        display
      }
      id
    }
  }
}

fragment BuyNowButton_artwork on Artwork {
  internalID
  saleMessage
}

fragment BidButton_artwork on Artwork {
  slug
  sale {
    slug
    registrationStatus {
      qualifiedForBidding
      id
    }
    isPreview
    isLiveOpen
    isClosed
    isRegistrationClosed
    id
  }
  myLotStanding(live: true) {
    mostRecentBid {
      maxBid {
        cents
      }
      id
    }
  }
  saleArtwork {
    increments {
      cents
    }
    id
  }
}

fragment MakeOfferButton_artwork on Artwork {
  internalID
}

fragment ArtworkActions_artwork on Artwork {
  id
  internalID
  slug
  title
  href
  is_saved: isSaved
  is_hangable: isHangable
  artists {
    name
    id
  }
  image {
    url
  }
  sale {
    isAuction
    isClosed
    id
  }
  widthCm
  heightCm
}

fragment ArtworkTombstone_artwork on Artwork {
  title
  isInAuction
  medium
  date
  cultural_maker: culturalMaker
  saleArtwork {
    lotLabel
    estimate
    id
  }
  partner {
    name
    id
  }
  sale {
    isClosed
    id
  }
  artists {
    name
    href
    ...FollowArtistButton_artist
    id
  }
  dimensions {
    in
    cm
  }
  edition_of: editionOf
  attribution_class: attributionClass {
    shortDescription
    id
  }
}

fragment ImageCarousel_images on Image {
  url: imageURL
  width
  height
  imageVersions
  deepZoom {
    image: Image {
      tileSize: TileSize
      url: Url
      format: Format
      size: Size {
        width: Width
        height: Height
      }
    }
  }
}

fragment FollowArtistButton_artist on Artist {
  id
  slug
  internalID
  is_followed: isFollowed
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "doesn't matter"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v6 = [
  (v5/*: any*/),
  (v1/*: any*/)
],
v7 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": (v6/*: any*/)
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cents",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "dimensions",
  "storageKey": null,
  "args": null,
  "concreteType": "dimensions",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "in",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "cm",
      "args": null,
      "storageKey": null
    }
  ]
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "saleMessage",
  "args": null,
  "storageKey": null
},
v12 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v13 = {
  "type": "Boolean",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v14 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v15 = {
  "type": "Float",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v16 = {
  "type": "Partner",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v17 = {
  "type": "dimensions",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v18 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v19 = {
  "type": "Int",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v20 = {
  "type": "BidderPosition",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtworkTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"doesn't matter\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Artwork_artworkAboveTheFold",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtworkTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"doesn't matter\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "title",
            "args": null,
            "storageKey": null
          },
          (v4/*: any*/),
          {
            "kind": "ScalarField",
            "alias": "is_saved",
            "name": "isSaved",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "is_hangable",
            "name": "isHangable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              (v5/*: any*/),
              (v1/*: any*/),
              (v4/*: any*/),
              (v3/*: any*/),
              (v2/*: any*/),
              {
                "kind": "ScalarField",
                "alias": "is_followed",
                "name": "isFollowed",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isConsignable",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "image",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "url",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "sale",
            "storageKey": null,
            "args": null,
            "concreteType": "Sale",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isAuction",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isClosed",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isLiveOpen",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isPreview",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "liveStartAt",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "endAt",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "startAt",
                "args": null,
                "storageKey": null
              },
              (v3/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "registrationStatus",
                "storageKey": null,
                "args": null,
                "concreteType": "Bidder",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "qualifiedForBidding",
                    "args": null,
                    "storageKey": null
                  },
                  (v1/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isRegistrationClosed",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isBenefit",
                "args": null,
                "storageKey": null
              },
              (v7/*: any*/),
              (v2/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isWithBuyersPremium",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "widthCm",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "heightCm",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isInAuction",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "medium",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "date",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "cultural_maker",
            "name": "culturalMaker",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "saleArtwork",
            "storageKey": null,
            "args": null,
            "concreteType": "SaleArtwork",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "lotLabel",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "estimate",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "increments",
                "storageKey": null,
                "args": null,
                "concreteType": "BidIncrementsFormatted",
                "plural": true,
                "selections": [
                  (v8/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "reserveMessage",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "currentBid",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtworkCurrentBid",
                "plural": false,
                "selections": [
                  (v9/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "counts",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtworkCounts",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "bidderPositions",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          (v7/*: any*/),
          (v10/*: any*/),
          {
            "kind": "ScalarField",
            "alias": "edition_of",
            "name": "editionOf",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "attribution_class",
            "name": "attributionClass",
            "storageKey": null,
            "args": null,
            "concreteType": "AttributionClass",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "shortDescription",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "images",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": "url",
                "name": "imageURL",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "width",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "height",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "imageVersions",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "deepZoom",
                "storageKey": null,
                "args": null,
                "concreteType": "DeepZoom",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": "image",
                    "name": "Image",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "DeepZoomImage",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": "tileSize",
                        "name": "TileSize",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "url",
                        "name": "Url",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "format",
                        "name": "Format",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": "size",
                        "name": "Size",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "DeepZoomImageSize",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": "width",
                            "name": "Width",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "height",
                            "name": "Height",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isAcquireable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isOfferable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isInquireable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "availability",
            "args": null,
            "storageKey": null
          },
          (v11/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isForSale",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "editionSets",
            "storageKey": null,
            "args": null,
            "concreteType": "EditionSet",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v11/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "editionOf",
                "args": null,
                "storageKey": null
              },
              (v10/*: any*/)
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isBuyNowable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "myLotStanding",
            "storageKey": "myLotStanding(live:true)",
            "args": [
              {
                "kind": "Literal",
                "name": "live",
                "value": true
              }
            ],
            "concreteType": "LotStanding",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "mostRecentBid",
                "storageKey": null,
                "args": null,
                "concreteType": "BidderPosition",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "maxBid",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "BidderPositionMaxBid",
                    "plural": false,
                    "selections": [
                      (v8/*: any*/),
                      (v9/*: any*/)
                    ]
                  },
                  (v1/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "activeBid",
                "storageKey": null,
                "args": null,
                "concreteType": "BidderPosition",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "isWinning",
                    "args": null,
                    "storageKey": null
                  },
                  (v1/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "shippingOrigin",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "shippingInfo",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "priceIncludesTaxDisplay",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": false,
            "selections": (v6/*: any*/)
          },
          {
            "kind": "ScalarField",
            "alias": "is_acquireable",
            "name": "isAcquireable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "is_offerable",
            "name": "isOfferable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "is_biddable",
            "name": "isBiddable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "is_inquireable",
            "name": "isInquireable",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtworkTestsQuery",
    "id": "067decf76d93b36b49b506f8c4438362",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "type": "Artwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.id": (v12/*: any*/),
        "artwork.slug": (v12/*: any*/),
        "artwork.internalID": (v12/*: any*/),
        "artwork.is_acquireable": (v13/*: any*/),
        "artwork.is_offerable": (v13/*: any*/),
        "artwork.is_biddable": (v13/*: any*/),
        "artwork.is_inquireable": (v13/*: any*/),
        "artwork.availability": (v14/*: any*/),
        "artwork.images": {
          "type": "Image",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "artwork.isAcquireable": (v13/*: any*/),
        "artwork.isOfferable": (v13/*: any*/),
        "artwork.isInquireable": (v13/*: any*/),
        "artwork.isInAuction": (v13/*: any*/),
        "artwork.saleMessage": (v14/*: any*/),
        "artwork.isForSale": (v13/*: any*/),
        "artwork.artists": {
          "type": "Artist",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "artwork.editionSets": {
          "type": "EditionSet",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "artwork.sale": {
          "type": "Sale",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.title": (v14/*: any*/),
        "artwork.href": (v14/*: any*/),
        "artwork.is_saved": (v13/*: any*/),
        "artwork.is_hangable": (v13/*: any*/),
        "artwork.image": {
          "type": "Image",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.widthCm": (v15/*: any*/),
        "artwork.heightCm": (v15/*: any*/),
        "artwork.medium": (v14/*: any*/),
        "artwork.date": (v14/*: any*/),
        "artwork.cultural_maker": (v14/*: any*/),
        "artwork.saleArtwork": {
          "type": "SaleArtwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.partner": (v16/*: any*/),
        "artwork.dimensions": (v17/*: any*/),
        "artwork.edition_of": (v14/*: any*/),
        "artwork.attribution_class": {
          "type": "AttributionClass",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artists.isConsignable": (v13/*: any*/),
        "artwork.artists.id": (v12/*: any*/),
        "artwork.editionSets.id": (v12/*: any*/),
        "artwork.sale.isClosed": (v13/*: any*/),
        "artwork.sale.isAuction": (v13/*: any*/),
        "artwork.sale.isLiveOpen": (v13/*: any*/),
        "artwork.sale.isPreview": (v13/*: any*/),
        "artwork.sale.liveStartAt": (v14/*: any*/),
        "artwork.sale.endAt": (v14/*: any*/),
        "artwork.sale.startAt": (v14/*: any*/),
        "artwork.sale.id": (v18/*: any*/),
        "artwork.isBuyNowable": (v13/*: any*/),
        "artwork.shippingOrigin": (v14/*: any*/),
        "artwork.shippingInfo": (v14/*: any*/),
        "artwork.priceIncludesTaxDisplay": (v14/*: any*/),
        "artwork.artist": {
          "type": "Artist",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.myLotStanding": {
          "type": "LotStanding",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "artwork.artists.name": (v14/*: any*/),
        "artwork.image.url": (v14/*: any*/),
        "artwork.saleArtwork.lotLabel": (v14/*: any*/),
        "artwork.saleArtwork.estimate": (v14/*: any*/),
        "artwork.saleArtwork.id": (v18/*: any*/),
        "artwork.partner.name": (v14/*: any*/),
        "artwork.partner.id": (v18/*: any*/),
        "artwork.artists.href": (v14/*: any*/),
        "artwork.dimensions.in": (v14/*: any*/),
        "artwork.dimensions.cm": (v14/*: any*/),
        "artwork.attribution_class.shortDescription": (v14/*: any*/),
        "artwork.attribution_class.id": (v18/*: any*/),
        "artwork.images.url": (v14/*: any*/),
        "artwork.images.width": (v19/*: any*/),
        "artwork.images.height": (v19/*: any*/),
        "artwork.images.imageVersions": {
          "type": "String",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "artwork.images.deepZoom": {
          "type": "DeepZoom",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.editionSets.internalID": (v12/*: any*/),
        "artwork.editionSets.saleMessage": (v14/*: any*/),
        "artwork.editionSets.editionOf": (v14/*: any*/),
        "artwork.editionSets.dimensions": (v17/*: any*/),
        "artwork.sale.isBenefit": (v13/*: any*/),
        "artwork.sale.partner": (v16/*: any*/),
        "artwork.artist.name": (v14/*: any*/),
        "artwork.artist.id": (v18/*: any*/),
        "artwork.sale.internalID": (v12/*: any*/),
        "artwork.sale.isWithBuyersPremium": (v13/*: any*/),
        "artwork.saleArtwork.reserveMessage": (v14/*: any*/),
        "artwork.saleArtwork.currentBid": {
          "type": "SaleArtworkCurrentBid",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.saleArtwork.counts": {
          "type": "SaleArtworkCounts",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.myLotStanding.activeBid": (v20/*: any*/),
        "artwork.myLotStanding.mostRecentBid": (v20/*: any*/),
        "artwork.artists.slug": (v12/*: any*/),
        "artwork.artists.internalID": (v12/*: any*/),
        "artwork.artists.is_followed": (v13/*: any*/),
        "artwork.images.deepZoom.image": {
          "type": "DeepZoomImage",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.sale.slug": (v12/*: any*/),
        "artwork.sale.registrationStatus": {
          "type": "Bidder",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.sale.isRegistrationClosed": (v13/*: any*/),
        "artwork.saleArtwork.increments": {
          "type": "BidIncrementsFormatted",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "artwork.editionSets.dimensions.in": (v14/*: any*/),
        "artwork.editionSets.dimensions.cm": (v14/*: any*/),
        "artwork.sale.partner.name": (v14/*: any*/),
        "artwork.sale.partner.id": (v18/*: any*/),
        "artwork.saleArtwork.currentBid.display": (v14/*: any*/),
        "artwork.saleArtwork.counts.bidderPositions": {
          "type": "FormattedNumber",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.myLotStanding.activeBid.isWinning": (v13/*: any*/),
        "artwork.myLotStanding.activeBid.id": (v18/*: any*/),
        "artwork.myLotStanding.mostRecentBid.maxBid": {
          "type": "BidderPositionMaxBid",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.myLotStanding.mostRecentBid.id": (v18/*: any*/),
        "artwork.images.deepZoom.image.tileSize": (v19/*: any*/),
        "artwork.images.deepZoom.image.url": (v14/*: any*/),
        "artwork.images.deepZoom.image.format": (v14/*: any*/),
        "artwork.images.deepZoom.image.size": {
          "type": "DeepZoomImageSize",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.sale.registrationStatus.qualifiedForBidding": (v13/*: any*/),
        "artwork.sale.registrationStatus.id": (v18/*: any*/),
        "artwork.saleArtwork.increments.cents": (v15/*: any*/),
        "artwork.myLotStanding.mostRecentBid.maxBid.display": (v14/*: any*/),
        "artwork.images.deepZoom.image.size.width": (v19/*: any*/),
        "artwork.images.deepZoom.image.size.height": (v19/*: any*/),
        "artwork.myLotStanding.mostRecentBid.maxBid.cents": (v15/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = 'd067b32ad76e98e236f5c6c651e5323b';
export default node;
