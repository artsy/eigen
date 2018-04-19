/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type SelectMaxBid_sale_artwork = {
    readonly bid_increments: ReadonlyArray<number | null> | null;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "SelectMaxBid_sale_artwork",
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
(node as any).hash = '52dc8e7bdfe90020241f2b017f8cee27';
export default node;
