/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _SellerInfo_artwork$ref: unique symbol;
export type SellerInfo_artwork$ref = typeof _SellerInfo_artwork$ref;
export type SellerInfo_artwork = {
    readonly availability: string | null;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly " $refType": SellerInfo_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SellerInfo_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "availability",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": "Partner",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '256b803b1f8c60488dd1f875e42b92e3';
export default node;
