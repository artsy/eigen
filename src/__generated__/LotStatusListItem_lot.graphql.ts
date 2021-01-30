/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionsSoldStatus = "ForSale" | "Passed" | "Sold" | "%future added value";
export type LotStatusListItem_lot = {
    readonly type: string;
    readonly lot: {
        readonly soldStatus: AuctionsSoldStatus;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ActiveLot_lotStanding" | "ClosedLot_lotStanding" | "WatchedLot_lot">;
    readonly " $refType": "LotStatusListItem_lot";
};
export type LotStatusListItem_lot$data = LotStatusListItem_lot;
export type LotStatusListItem_lot$key = {
    readonly " $data"?: LotStatusListItem_lot$data;
    readonly " $fragmentRefs": FragmentRefs<"LotStatusListItem_lot">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LotStatusListItem_lot",
  "selections": [
    {
      "alias": "type",
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
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
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "soldStatus",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ActiveLot_lotStanding"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ClosedLot_lotStanding"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WatchedLot_lot"
    }
  ],
  "type": "LotLike",
  "abstractKey": "__isLotLike"
};
(node as any).hash = 'bdc76867e43dc75e40e43fed714e0c12';
export default node;
