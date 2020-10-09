/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 6d244de9906e4602332d1cf51d127e2b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionPriceTestsQueryVariables = {};
export type AuctionPriceTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"AuctionPrice_artwork">;
    } | null;
};
export type AuctionPriceTestsQueryRawResponse = {
    readonly artwork: ({
        readonly sale: ({
            readonly internalID: string;
            readonly isWithBuyersPremium: boolean | null;
            readonly isClosed: boolean | null;
            readonly isLiveOpen: boolean | null;
            readonly id: string;
        }) | null;
        readonly saleArtwork: ({
            readonly reserveMessage: string | null;
            readonly currentBid: ({
                readonly display: string | null;
            }) | null;
            readonly counts: ({
                readonly bidderPositions: number | null;
            }) | null;
            readonly id: string;
        }) | null;
        readonly myLotStanding: ReadonlyArray<{
            readonly activeBid: ({
                readonly isWinning: boolean | null;
                readonly id: string;
            }) | null;
            readonly mostRecentBid: ({
                readonly maxBid: ({
                    readonly display: string | null;
                }) | null;
                readonly id: string;
            }) | null;
        }> | null;
        readonly id: string;
    }) | null;
};
export type AuctionPriceTestsQuery = {
    readonly response: AuctionPriceTestsQueryResponse;
    readonly variables: AuctionPriceTestsQueryVariables;
    readonly rawResponse: AuctionPriceTestsQueryRawResponse;
};



/*
query AuctionPriceTestsQuery {
  artwork(id: "auction_artwork_estimate_premium") {
    ...AuctionPrice_artwork
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "auction_artwork_estimate_premium"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AuctionPriceTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "AuctionPrice_artwork"
          }
        ],
        "storageKey": "artwork(id:\"auction_artwork_estimate_premium\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AuctionPriceTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Sale",
            "kind": "LinkedField",
            "name": "sale",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "internalID",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isWithBuyersPremium",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isClosed",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isLiveOpen",
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "SaleArtwork",
            "kind": "LinkedField",
            "name": "saleArtwork",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "reserveMessage",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "SaleArtworkCurrentBid",
                "kind": "LinkedField",
                "name": "currentBid",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "SaleArtworkCounts",
                "kind": "LinkedField",
                "name": "counts",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "bidderPositions",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "live",
                "value": true
              }
            ],
            "concreteType": "LotStanding",
            "kind": "LinkedField",
            "name": "myLotStanding",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "BidderPosition",
                "kind": "LinkedField",
                "name": "activeBid",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isWinning",
                    "storageKey": null
                  },
                  (v1/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "BidderPosition",
                "kind": "LinkedField",
                "name": "mostRecentBid",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BidderPositionMaxBid",
                    "kind": "LinkedField",
                    "name": "maxBid",
                    "plural": false,
                    "selections": (v2/*: any*/),
                    "storageKey": null
                  },
                  (v1/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": "myLotStanding(live:true)"
          },
          (v1/*: any*/)
        ],
        "storageKey": "artwork(id:\"auction_artwork_estimate_premium\")"
      }
    ]
  },
  "params": {
    "id": "6d244de9906e4602332d1cf51d127e2b",
    "metadata": {},
    "name": "AuctionPriceTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'e19a32c63c473884513a6119095fe8ad';
export default node;
