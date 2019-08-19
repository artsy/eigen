/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _AuctionPrice_artwork$ref: unique symbol;
export type AuctionPrice_artwork$ref = typeof _AuctionPrice_artwork$ref;
export type AuctionPrice_artwork = {
    readonly slug: string;
    readonly sale: {
        readonly isWithBuyersPremium: boolean | null;
    } | null;
    readonly saleArtwork: {
        readonly isWithReserve: boolean | null;
        readonly reserveMessage: string | null;
        readonly reserveStatus: string | null;
        readonly currentBid: {
            readonly display: string | null;
        } | null;
        readonly counts: {
            readonly bidderPositions: any | null;
        } | null;
    } | null;
    readonly myLotStanding: ReadonlyArray<{
        readonly activeBid: {
            readonly isWinning: boolean | null;
        } | null;
        readonly mostRecentBid: {
            readonly maxBid: {
                readonly display: string | null;
            } | null;
        } | null;
    }> | null;
    readonly " $refType": AuctionPrice_artwork$ref;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "AuctionPrice_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
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
          "selections": (v0/*: any*/)
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
            }
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
              "selections": (v0/*: any*/)
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'bfcf3229fe2931136f33b2ac2fce5fd4';
export default node;
