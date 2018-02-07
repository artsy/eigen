/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type Inquiry_artwork = {
    readonly _id: string;
    readonly id: string;
    readonly contact_message: string | null;
    readonly partner: ({
        readonly name: string | null;
    }) | null;
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
  "name": "Inquiry_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "_id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
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
      ],
      "idField": "__id"
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkPreview_artwork",
      "args": null
    },
    v0
  ],
  "idField": "__id"
};
})();
(node as any).hash = '1af371838f3f0980e5bdf7ddc7af01ee';
export default node;
