/* tslint:disable */
/* eslint-disable */

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
    "kind": "ScalarField",
    "alias": null,
    "name": "displayAmount",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "ActiveLot_lotStanding",
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
          "kind": "FragmentSpread",
          "name": "Lot_saleArtwork",
          "args": null
        }
      ]
    }
  ]
};
})();
(node as any).hash = '132644c98cac08cf6c0c340cdc16abc7';
export default node;
