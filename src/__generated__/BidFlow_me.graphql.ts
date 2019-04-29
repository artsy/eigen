/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { SelectMaxBid_me$ref } from "./SelectMaxBid_me.graphql";
declare const _BidFlow_me$ref: unique symbol;
export type BidFlow_me$ref = typeof _BidFlow_me$ref;
export type BidFlow_me = {
    readonly " $fragmentRefs": SelectMaxBid_me$ref;
    readonly " $refType": BidFlow_me$ref;
};



const node: ConcreteFragment = {
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
    },
    {
      "kind": "ScalarField",
      "alias": "__id",
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'd6b2136c99c5ca1a381cce7811303d1f';
export default node;
