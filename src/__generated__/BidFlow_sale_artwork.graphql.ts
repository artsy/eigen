/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type BidFlow_sale_artwork = {
    readonly increments: ReadonlyArray<({
            readonly display: string | null;
            readonly cents: number | null;
        }) | null> | null;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "BidFlow_sale_artwork",
  "type": "SaleArtwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "increments",
      "storageKey": null,
      "args": null,
      "concreteType": "BidIncrementsFormatted",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "display",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "cents",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ConfirmBid_sale_artwork",
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
(node as any).hash = 'b56eddb8e2ac6c1e7db7e8ecef00c8d2';
export default node;
