/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionsReserveStatus = "NoReserve" | "ReserveMet" | "ReserveNotMet" | "%future added value";
export type AuctionsSoldStatus = "ForSale" | "Passed" | "Sold" | "%future added value";
export type ClosedLot_lotStanding = {
    readonly isHighestBidder: boolean;
    readonly lotState: {
        readonly internalID: string;
        readonly saleId: string;
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
            readonly displayTimelyAt: string | null;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"Lot_saleArtwork">;
    } | null;
    readonly " $refType": "ClosedLot_lotStanding";
};
export type ClosedLot_lotStanding$data = ClosedLot_lotStanding;
export type ClosedLot_lotStanding$key = {
    readonly " $data"?: ClosedLot_lotStanding$data;
    readonly " $fragmentRefs": FragmentRefs<"ClosedLot_lotStanding">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "displayAmount",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "ClosedLot_lotStanding",
  "type": "AuctionsLotStanding",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isHighestBidder",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "lotState",
      "storageKey": null,
      "args": null,
      "concreteType": "AuctionsLotState",
      "plural": false,
      "selections": [
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
          "name": "saleId",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "bidCount",
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
          "kind": "ScalarField",
          "alias": null,
          "name": "soldStatus",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": "askingPrice",
          "name": "onlineAskingPrice",
          "storageKey": null,
          "args": null,
          "concreteType": "AuctionsMoney",
          "plural": false,
          "selections": (v0/*: any*/)
        },
        {
          "kind": "LinkedField",
          "alias": "sellingPrice",
          "name": "floorSellingPrice",
          "storageKey": null,
          "args": null,
          "concreteType": "AuctionsMoney",
          "plural": false,
          "selections": (v0/*: any*/)
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
          "name": "sale",
          "storageKey": null,
          "args": null,
          "concreteType": "Sale",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "displayTimelyAt",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "FragmentSpread",
          "name": "Lot_saleArtwork",
          "args": null
        }
      ]
    }
  ]
};
})();
(node as any).hash = '2d2fee61e7f2ea32d77c3573f15be4f7';
export default node;
