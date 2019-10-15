/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ShowPreview_show$ref: unique symbol;
export type ShowPreview_show$ref = typeof _ShowPreview_show$ref;
export type ShowPreview_show = {
    readonly slug: string;
    readonly internalID: string;
    readonly name: string | null;
    readonly cover_image: {
        readonly url: string | null;
    } | null;
    readonly fair: {
        readonly name: string | null;
    } | null;
    readonly partner: {
        readonly name?: string | null;
    } | null;
    readonly " $refType": ShowPreview_show$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
];
return {
  "kind": "Fragment",
  "name": "ShowPreview_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": "cover_image",
      "name": "coverImage",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "fair",
      "storageKey": null,
      "args": null,
      "concreteType": "Fair",
      "plural": false,
      "selections": (v1/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": (v1/*: any*/)
        }
      ]
    }
  ]
};
})();
(node as any).hash = '913664f2b5ed820cd0a1831028e31c44';
export default node;
