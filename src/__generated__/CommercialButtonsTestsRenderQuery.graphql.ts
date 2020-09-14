/* tslint:disable */
/* eslint-disable */
/* @relayHash 5e3f1052552e2654f0a93ab983f446ba */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommercialButtonsTestsRenderQueryVariables = {};
export type CommercialButtonsTestsRenderQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"CommercialButtons_artwork">;
    } | null;
};
export type CommercialButtonsTestsRenderQueryRawResponse = {
    readonly artwork: ({
        readonly slug: string;
        readonly isAcquireable: boolean | null;
        readonly isOfferable: boolean | null;
        readonly isInquireable: boolean | null;
        readonly isInAuction: boolean | null;
        readonly isBuyNowable: boolean | null;
        readonly isForSale: boolean | null;
        readonly editionSets: ReadonlyArray<({
            readonly id: string;
        }) | null> | null;
        readonly sale: ({
            readonly isClosed: boolean | null;
            readonly id: string | null;
            readonly slug: string;
            readonly registrationStatus: ({
                readonly qualifiedForBidding: boolean | null;
                readonly id: string | null;
            }) | null;
            readonly isPreview: boolean | null;
            readonly isLiveOpen: boolean | null;
            readonly isRegistrationClosed: boolean | null;
            readonly requireIdentityVerification: boolean | null;
        }) | null;
        readonly internalID: string;
        readonly saleMessage: string | null;
        readonly myLotStanding: ReadonlyArray<{
            readonly mostRecentBid: ({
                readonly maxBid: ({
                    readonly cents: number | null;
                }) | null;
                readonly id: string | null;
            }) | null;
        }> | null;
        readonly saleArtwork: ({
            readonly increments: ReadonlyArray<({
                readonly cents: number | null;
            }) | null> | null;
            readonly id: string | null;
        }) | null;
        readonly imageUrl: string | null;
        readonly isPriceHidden: boolean | null;
        readonly title: string | null;
        readonly date: string | null;
        readonly medium: string | null;
        readonly dimensions: ({
            readonly in: string | null;
            readonly cm: string | null;
        }) | null;
        readonly editionOf: string | null;
        readonly signatureInfo: ({
            readonly details: string | null;
        }) | null;
        readonly artist: ({
            readonly name: string | null;
            readonly id: string | null;
        }) | null;
        readonly id: string | null;
    }) | null;
};
export type CommercialButtonsTestsRenderQuery = {
    readonly response: CommercialButtonsTestsRenderQueryResponse;
    readonly variables: CommercialButtonsTestsRenderQueryVariables;
    readonly rawResponse: CommercialButtonsTestsRenderQueryRawResponse;
};



/*
query CommercialButtonsTestsRenderQuery {
  artwork(id: "artworkID") {
    ...CommercialButtons_artwork
    id
  }
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
    requireIdentityVerification
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

fragment BuyNowButton_artwork on Artwork {
  internalID
  saleMessage
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
  ...InquiryButtons_artwork
}

fragment InquiryButtons_artwork on Artwork {
  imageUrl
  internalID
  isPriceHidden
  title
  date
  medium
  dimensions {
    in
    cm
  }
  editionOf
  signatureInfo {
    details
  }
  artist {
    name
    id
  }
}

fragment MakeOfferButton_artwork on Artwork {
  internalID
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "artworkID"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "cents",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "CommercialButtonsTestsRenderQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"artworkID\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "CommercialButtons_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CommercialButtonsTestsRenderQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"artworkID\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
            "name": "isInAuction",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isBuyNowable",
            "args": null,
            "storageKey": null
          },
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
              (v2/*: any*/)
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
                "name": "isClosed",
                "args": null,
                "storageKey": null
              },
              (v2/*: any*/),
              (v1/*: any*/),
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
                  (v2/*: any*/)
                ]
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
                "name": "isLiveOpen",
                "args": null,
                "storageKey": null
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
                "name": "requireIdentityVerification",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "saleMessage",
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
                    "selections": (v3/*: any*/)
                  },
                  (v2/*: any*/)
                ]
              }
            ]
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
                "kind": "LinkedField",
                "alias": null,
                "name": "increments",
                "storageKey": null,
                "args": null,
                "concreteType": "BidIncrementsFormatted",
                "plural": true,
                "selections": (v3/*: any*/)
              },
              (v2/*: any*/)
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "imageUrl",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isPriceHidden",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "title",
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
            "alias": null,
            "name": "medium",
            "args": null,
            "storageKey": null
          },
          {
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
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "editionOf",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "signatureInfo",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "details",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              },
              (v2/*: any*/)
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CommercialButtonsTestsRenderQuery",
    "id": "6a7ff0da08898b092ac071333ac97cdb",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'e6032e41bb2e166a864d1a8ddd18cfb5';
export default node;
