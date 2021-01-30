/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionsSoldStatus = "ForSale" | "Passed" | "Sold" | "%future added value";
export type LotStatusListItem_lotStanding = {
    readonly lot: {
        readonly soldStatus: AuctionsSoldStatus;
    };
    readonly " $fragmentRefs": FragmentRefs<"ActiveLot_lotStanding" | "ClosedLot_lotStanding">;
    readonly " $refType": "LotStatusListItem_lotStanding";
};
export type LotStatusListItem_lotStanding$data = LotStatusListItem_lotStanding;
export type LotStatusListItem_lotStanding$key = {
    readonly " $data"?: LotStatusListItem_lotStanding$data;
    readonly " $fragmentRefs": FragmentRefs<"LotStatusListItem_lotStanding">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LotStatusListItem_lotStanding",
  "selections": [
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
    }
  ],
  "type": "AuctionsLotStanding",
  "abstractKey": null
};
(node as any).hash = '6649ceba0b25759250ff0085f6e7a00f';
export default node;
