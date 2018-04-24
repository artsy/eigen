/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type BidFlow_sale_artwork = {
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
(node as any).hash = '1a76a940ad2eb57c5e4e97dc89bd6e02';
export default node;
