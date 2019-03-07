/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _ShowItemRow_show$ref: unique symbol;
export type ShowItemRow_show$ref = typeof _ShowItemRow_show$ref;
export type ShowItemRow_show = {
    readonly id: string;
    readonly _id: string;
    readonly __id: string;
    readonly is_followed: boolean | null;
    readonly name: string | null;
    readonly partner: ({
        readonly name?: string | null;
    }) | null;
    readonly href: string | null;
    readonly exhibition_period: string | null;
    readonly status: string | null;
    readonly cover_image: ({
        readonly url: string | null;
        readonly aspect_ratio: number;
    }) | null;
    readonly is_fair_booth: boolean | null;
    readonly start_at: string | null;
    readonly end_at: string | null;
    readonly " $refType": ShowItemRow_show$ref;
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
  "name": "ShowItemRow_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "id",
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
      "name": "_id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "exhibition_period",
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
      "name": "cover_image",
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
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "aspect_ratio",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_fair_booth",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "start_at",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "end_at",
      "args": null,
      "storageKey": null
    }
  ]
};
})();
(node as any).hash = 'd1735c0a8cbfe2b5027692c75a7d0de2';
export default node;
