/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { AuctionPrice_artwork$ref } from "./AuctionPrice_artwork.graphql";
export type AuctionPriceTestsQueryVariables = {};
export type AuctionPriceTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": AuctionPrice_artwork$ref;
    } | null;
};
export type AuctionPriceTestsQuery = {
    readonly response: AuctionPriceTestsQueryResponse;
    readonly variables: AuctionPriceTestsQueryVariables;
};



/*
query AuctionPriceTestsQuery {
  artwork(id: "auction_artwork_estimate_premium") {
    ...AuctionPrice_artwork
    id
  }
}

fragment AuctionPrice_artwork on Artwork {
  slug
  sale {
    isWithBuyersPremium
    isClosed
    isLiveOpen
    id
  }
  saleArtwork {
    isWithReserve
    reserveMessage
    reserveStatus
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
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AuctionPriceTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"auction_artwork_estimate_premium\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "AuctionPrice_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AuctionPriceTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"auction_artwork_estimate_premium\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "slug",
            "args": null,
            "storageKey": null
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
                "name": "isWithBuyersPremium",
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isLiveOpen",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/)
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
                "kind": "ScalarField",
                "alias": null,
                "name": "isWithReserve",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "reserveMessage",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "reserveStatus",
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
                "selections": (v2/*: any*/)
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
              },
              (v1/*: any*/)
            ]
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
              },
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
                    "selections": (v2/*: any*/)
                  },
                  (v1/*: any*/)
                ]
              }
            ]
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "AuctionPriceTestsQuery",
    "id": "5f7c3b3077c62677131e9f5bf386dbbf",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '5cb00a50595f50c32e89c7b294b6635a';
export default node;
