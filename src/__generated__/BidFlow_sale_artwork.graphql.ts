/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type BidFlow_sale_artwork = {
    readonly bid_increments: ReadonlyArray<number | null> | null;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "BidFlow_sale_artwork",
  "type": "SaleArtwork",
  "metadata": null,
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
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'ec3c6aca869a3151e0c323ca0c473ada';
export default node;
