/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _SavedShowItemRow_show$ref: unique symbol;
export type SavedShowItemRow_show$ref = typeof _SavedShowItemRow_show$ref;
export type SavedShowItemRow_show = {
    readonly id: string;
    readonly _id: string;
    readonly __id: string;
    readonly is_followed: boolean | null;
    readonly name: string | null;
    readonly partner: ({
        readonly name?: string | null;
    }) | null;
    readonly href: string | null;
    readonly status: string | null;
    readonly images: ReadonlyArray<({
        readonly url: string | null;
    }) | null> | null;
    readonly " $refType": SavedShowItemRow_show$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = [
  v1
];
return {
  "kind": "Fragment",
  "name": "SavedShowItemRow_show",
  "type": "Show",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "_id",
      "args": null,
      "storageKey": null
    },
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_followed",
      "args": null,
      "storageKey": null
    },
    v1,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        v0,
        {
          "kind": "InlineFragment",
          "type": "ExternalPartner",
          "selections": v2
        },
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": v2
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "href",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "status",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "images",
      "storageKey": "images(size:1)",
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 1,
          "type": "Int"
        }
      ],
      "concreteType": "Image",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'fc6653710752cacd708d4c5180bf27ea';
export default node;
