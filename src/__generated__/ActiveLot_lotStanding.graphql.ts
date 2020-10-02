/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionsReserveStatus = "NoReserve" | "ReserveMet" | "ReserveNotMet" | "%future added value";
export type AuctionsSoldStatus = "ForSale" | "Passed" | "Sold" | "%future added value";
export type ActiveLot_lotStanding = {
    readonly isHighestBidder: boolean;
    readonly lotState: {
        readonly internalID: string;
        readonly bidCount: number;
        readonly reserveStatus: AuctionsReserveStatus;
        readonly soldStatus: AuctionsSoldStatus;
        readonly askingPrice: {
            readonly displayAmount: string;
        };
        readonly sellingPrice: {
            readonly displayAmount: string;
        } | null;
    };
    readonly saleArtwork: {
        readonly sale: {
            readonly liveStartAt: string | null;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"Lot_saleArtwork">;
    } | null;
    readonly " $refType": "ActiveLot_lotStanding";
};
export type ActiveLot_lotStanding$data = ActiveLot_lotStanding;
export type ActiveLot_lotStanding$key = {
    readonly " $data"?: ActiveLot_lotStanding$data;
    readonly " $fragmentRefs": FragmentRefs<"ActiveLot_lotStanding">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "fractionalDigits",
        "value": 0
      }
    ],
    "kind": "ScalarField",
    "name": "displayAmount",
    "storageKey": "displayAmount(fractionalDigits:0)"
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ActiveLot_lotStanding",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isHighestBidder",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AuctionsLotState",
      "kind": "LinkedField",
      "name": "lotState",
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
          "name": "bidCount",
          "storageKey": null
        },
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
          "kind": "ScalarField",
          "name": "soldStatus",
          "storageKey": null
        },
        {
          "alias": "askingPrice",
          "args": null,
          "concreteType": "AuctionsMoney",
          "kind": "LinkedField",
          "name": "onlineAskingPrice",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        },
        {
          "alias": "sellingPrice",
          "args": null,
          "concreteType": "AuctionsMoney",
          "kind": "LinkedField",
          "name": "floorSellingPrice",
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
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "Lot_saleArtwork"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "AuctionsLotStanding",
  "abstractKey": null
};
})();
(node as any).hash = '92094a5996a0066dabc4c4065c080578';
export default node;
