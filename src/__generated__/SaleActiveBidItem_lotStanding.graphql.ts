/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleActiveBidItem_lotStanding = {
    readonly activeBid: {
        readonly isWinning: boolean | null;
    } | null;
    readonly mostRecentBid: {
        readonly maxBid: {
            readonly display: string | null;
        } | null;
    } | null;
    readonly saleArtwork: {
        readonly reserveStatus: string | null;
        readonly counts: {
            readonly bidderPositions: number | null;
        } | null;
        readonly currentBid: {
            readonly display: string | null;
        } | null;
        readonly artwork: {
            readonly href: string | null;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"Lot_saleArtwork">;
    } | null;
    readonly sale: {
        readonly liveStartAt: string | null;
    } | null;
    readonly " $refType": "SaleActiveBidItem_lotStanding";
};
export type SaleActiveBidItem_lotStanding$data = SaleActiveBidItem_lotStanding;
export type SaleActiveBidItem_lotStanding$key = {
    readonly " $data"?: SaleActiveBidItem_lotStanding$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleActiveBidItem_lotStanding">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SaleActiveBidItem_lotStanding",
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
        }
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
          "selections": (v0/*: any*/),
          "storageKey": null
        }
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
          "name": "reserveStatus",
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
        {
          "alias": null,
          "args": null,
          "concreteType": "SaleArtworkCurrentBid",
          "kind": "LinkedField",
          "name": "currentBid",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Artwork",
          "kind": "LinkedField",
          "name": "artwork",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "href",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "Lot_saleArtwork"
        }
      ],
      "storageKey": null
    },
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
          "name": "liveStartAt",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "LotStanding",
  "abstractKey": null
};
})();
(node as any).hash = '2860939b4f5e1c6d7ca54e2db34d37d2';
export default node;
