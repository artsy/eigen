/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { Artists_show$ref } from "./Artists_show.graphql";
import { Artworks_show$ref } from "./Artworks_show.graphql";
import { Location_show$ref } from "./Location_show.graphql";
import { ShowHeader_show$ref } from "./ShowHeader_show.graphql";
declare const _Detail_show$ref: unique symbol;
export type Detail_show$ref = typeof _Detail_show$ref;
export type Detail_show = {
    readonly id: string;
    readonly name: string | null;
    readonly description: string | null;
    readonly status: string | null;
    readonly counts: ({
        readonly artworks: number | null;
        readonly eligible_artworks: any | null;
    }) | null;
    readonly partner: ({
        readonly name?: string | null;
    }) | null;
    readonly " $fragmentRefs": ShowHeader_show$ref & Location_show$ref & Artworks_show$ref & Artists_show$ref;
    readonly " $refType": Detail_show$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v2 = [
  v0
];
return {
  "kind": "Fragment",
  "name": "Detail_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Artworks_show",
      "args": null
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
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ShowHeader_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Location_show",
      "args": null
    },
    v0,
    {
      "kind": "FragmentSpread",
      "name": "Artists_show",
      "args": null
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
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "ShowCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artworks",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "eligible_artworks",
          "args": null,
          "storageKey": null
        }
      ]
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
        v1,
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": v2
        },
        {
          "kind": "InlineFragment",
          "type": "ExternalPartner",
          "selections": v2
        }
      ]
    },
    v1
  ]
};
})();
(node as any).hash = '03ef04b8e874af6ecdd2348dba91770e';
export default node;
