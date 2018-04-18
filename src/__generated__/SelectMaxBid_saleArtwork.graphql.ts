/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type SelectMaxBid_saleArtwork = {
    readonly bid_increments: ReadonlyArray<number | null> | null;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "SelectMaxBid_saleArtwork",
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
(node as any).hash = 'b72e4a691f54c988c18d6fca2453189e';
export default node;
