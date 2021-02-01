/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionsReserveStatus = "NoReserve" | "ReserveMet" | "ReserveNotMet" | "%future added value";
export type AuctionsSoldStatus = "ForSale" | "Passed" | "Sold" | "%future added value";
export type ClosedLotStanding_lotStanding = {
    readonly isHighestBidder: boolean;
    readonly lot: {
        readonly internalID: string;
        readonly saleId: string;
        readonly bidCount: number;
        readonly reserveStatus: AuctionsReserveStatus;
        readonly soldStatus: AuctionsSoldStatus;
        readonly sellingPrice: {
            readonly display: string | null;
        } | null;
    };
    readonly saleArtwork: {
        readonly artwork: {
            readonly internalID: string;
            readonly href: string | null;
            readonly slug: string;
        } | null;
        readonly sale: {
            readonly endAt: string | null;
            readonly status: string | null;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"Lot_saleArtwork">;
    } | null;
    readonly " $refType": "ClosedLotStanding_lotStanding";
};
export type ClosedLotStanding_lotStanding$data = ClosedLotStanding_lotStanding;
export type ClosedLotStanding_lotStanding$key = {
    readonly " $data"?: ClosedLotStanding_lotStanding$data;
    readonly " $fragmentRefs": FragmentRefs<"ClosedLotStanding_lotStanding">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ClosedLotStanding_lotStanding",
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
      "name": "lot",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "saleId",
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
          "alias": null,
          "args": null,
          "concreteType": "Money",
          "kind": "LinkedField",
          "name": "sellingPrice",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "display",
              "storageKey": null
            }
          ],
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
          "concreteType": "Artwork",
          "kind": "LinkedField",
          "name": "artwork",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "href",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "slug",
              "storageKey": null
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
              "name": "endAt",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "status",
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
(node as any).hash = '3182e3dbf02d6b71bed58ac014451e3b';
export default node;
