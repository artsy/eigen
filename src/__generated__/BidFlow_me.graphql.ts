/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type BidFlow_me = {
    readonly " $fragmentRefs": FragmentRefs<"ConfirmBid_me">;
    readonly " $refType": "BidFlow_me";
};
export type BidFlow_me$data = BidFlow_me;
export type BidFlow_me$key = {
    readonly " $data"?: BidFlow_me$data;
    readonly " $fragmentRefs": FragmentRefs<"BidFlow_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BidFlow_me",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ConfirmBid_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '430301d999e7055295d9e8957f39f1d3';
export default node;
