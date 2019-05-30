/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _SellerInfo_artwork$ref: unique symbol;
export type SellerInfo_artwork$ref = typeof _SellerInfo_artwork$ref;
export type SellerInfo_artwork = {
    readonly partner: ({
        readonly name: string | null;
    }) | null;
    readonly " $refType": SellerInfo_artwork$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "SellerInfo_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
        },
        v0
      ]
    },
    v0
  ]
};
})();
(node as any).hash = '490867aced0224449daac54947d7f5c4';
export default node;
