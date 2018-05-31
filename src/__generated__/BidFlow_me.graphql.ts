/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type BidFlow_me = {
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
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'd6b2136c99c5ca1a381cce7811303d1f';
export default node;
