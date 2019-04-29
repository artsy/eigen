/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { SelectMaxBid_sale_artwork$ref } from "./SelectMaxBid_sale_artwork.graphql";
declare const _BidFlow_sale_artwork$ref: unique symbol;
export type BidFlow_sale_artwork$ref = typeof _BidFlow_sale_artwork$ref;
export type BidFlow_sale_artwork = {
    readonly " $fragmentRefs": SelectMaxBid_sale_artwork$ref;
    readonly " $refType": BidFlow_sale_artwork$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "BidFlow_sale_artwork",
  "type": "SaleArtwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "SelectMaxBid_sale_artwork",
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
(node as any).hash = '783deb640df28b5155fc21968460a57c';
export default node;
