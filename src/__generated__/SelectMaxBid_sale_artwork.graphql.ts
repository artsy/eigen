/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type SelectMaxBid_sale_artwork = {
    readonly increments: ReadonlyArray<({
            readonly display: string | null;
            readonly cents: number | null;
        }) | null> | null;
    readonly _id: string;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "SelectMaxBid_sale_artwork",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "_id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ConfirmBid_sale_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ConfirmFirstTimeBid_sale_artwork",
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
(node as any).hash = 'a5dead710438743c014df836be1d027f';
export default node;
