/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ArtworkPreview_artwork$ref } from "./ArtworkPreview_artwork.graphql";
declare const _Inquiry_artwork$ref: unique symbol;
export type Inquiry_artwork$ref = typeof _Inquiry_artwork$ref;
export type Inquiry_artwork = {
    readonly internalID: string;
    readonly gravityID: string;
    readonly contact_message: string | null;
    readonly partner: ({
        readonly name: string | null;
    }) | null;
    readonly " $fragmentRefs": ArtworkPreview_artwork$ref;
    readonly " $refType": Inquiry_artwork$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Inquiry_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "gravityID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "contact_message",
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
        },
        v0
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkPreview_artwork",
      "args": null
    },
    v0
  ]
};
})();
(node as any).hash = '2e11e336d72a6fecec5b35b5bcabfcea';
export default node;
