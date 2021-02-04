/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LotStatusListItem_lot = {
    readonly " $fragmentRefs": FragmentRefs<"WatchedLot_lot">;
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "WatchedLot_lot"
    }
  ],
  "type": "Lot",
  "abstractKey": null
};
(node as any).hash = 'ad4007d2799357c635a950822f07123d';
export default node;
