/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ConfirmBid_sale_artwork$ref } from "./ConfirmBid_sale_artwork.graphql";
declare const _SelectMaxBid_sale_artwork$ref: unique symbol;
export type SelectMaxBid_sale_artwork$ref = typeof _SelectMaxBid_sale_artwork$ref;
export type SelectMaxBid_sale_artwork = {
    readonly id: string;
    readonly increments: ReadonlyArray<{
        readonly display: string | null;
    } | null> | null;
    readonly " $fragmentRefs": ConfirmBid_sale_artwork$ref;
    readonly " $refType": SelectMaxBid_sale_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SelectMaxBid_sale_artwork",
  "type": "SaleArtwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "increments",
      "storageKey": "increments(useMyMaxBid:true)",
      "args": [
        {
          "kind": "Literal",
          "name": "useMyMaxBid",
          "value": true
        }
      ],
      "concreteType": "BidIncrementsFormatted",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "display",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ConfirmBid_sale_artwork",
      "args": null
    }
  ]
};
(node as any).hash = 'a02cfab9770fae1ebabcd2357d637878';
export default node;
