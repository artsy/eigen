/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type BidFlow_me = {
    readonly " $fragmentRefs": FragmentRefs<"SelectMaxBid_me">;
    readonly " $refType": "BidFlow_me";
};
export type BidFlow_me$data = BidFlow_me;
export type BidFlow_me$key = {
    readonly " $data"?: BidFlow_me$data;
    readonly " $fragmentRefs": FragmentRefs<"BidFlow_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "BidFlow_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "SelectMaxBid_me",
      "args": null
    }
  ]
};
(node as any).hash = 'd6b2136c99c5ca1a381cce7811303d1f';
export default node;
