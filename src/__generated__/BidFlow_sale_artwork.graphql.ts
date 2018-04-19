/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type BidFlow_sale_artwork = {
    readonly bid_increments: ReadonlyArray<number | null> | null;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "BidFlow_sale_artwork",
  "type": "SaleArtwork",
  "metadata": {},
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "bid_increments",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "SelectMaxBid_sale_artwork",
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
(node as any).hash = '7bde3a2109d18f581b0b6c0d2e577f6d';
export default node;
