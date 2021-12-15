/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OrderInformation_artwork = {
    readonly listPrice: {
        readonly display?: string | null;
    } | null;
    readonly " $refType": "OrderInformation_artwork";
};
export type OrderInformation_artwork$data = OrderInformation_artwork;
export type OrderInformation_artwork$key = {
    readonly " $data"?: OrderInformation_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"OrderInformation_artwork">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrderInformation_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "listPrice",
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "selections": (v0/*: any*/),
          "type": "Money",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": (v0/*: any*/),
          "type": "PriceRange",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
})();
(node as any).hash = 'bb2a73652ffb484a0619ba13e63c619a';
export default node;
