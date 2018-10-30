/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { Location_show$ref } from "./Location_show.graphql";
import { ShowHeader_show$ref } from "./ShowHeader_show.graphql";
declare const _Show_show$ref: unique symbol;
export type Show_show$ref = typeof _Show_show$ref;
export type Show_show = {
    readonly id: string;
    readonly name: string | null;
    readonly description: string | null;
    readonly press_release: string | null;
    readonly artists: ReadonlyArray<({
        readonly __id: string;
        readonly id: string;
        readonly name: string | null;
        readonly is_followed: boolean | null;
    }) | null> | null;
    readonly artworks: ReadonlyArray<({
        readonly __id: string;
        readonly id: string;
        readonly artist_names: string | null;
        readonly image: ({
            readonly id: string | null;
            readonly url: string | null;
        }) | null;
        readonly price: string | null;
        readonly availability: string | null;
        readonly contact_label: string | null;
    }) | null> | null;
    readonly counts: ({
        readonly artworks: number | null;
        readonly eligible_artworks: any | null;
    }) | null;
    readonly partner: ({
        readonly name?: string | null;
    }) | null;
    readonly " $fragmentRefs": ShowHeader_show$ref & Location_show$ref;
    readonly " $refType": Show_show$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
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
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v3 = [
  v1
];
return {
  "kind": "Fragment",
  "name": "Show_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Location_show",
      "args": null
    },
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "press_release",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ShowHeader_show",
      "args": null
    },
    v1,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        v2,
        v0,
        v1,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "is_followed",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artworks",
      "storageKey": null,
      "args": null,
      "concreteType": "Artwork",
      "plural": true,
      "selections": [
        v2,
        v0,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artist_names",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "image",
          "storageKey": null,
          "args": null,
          "concreteType": "Image",
          "plural": false,
          "selections": [
            v0,
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
          "kind": "ScalarField",
          "alias": null,
          "name": "price",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "availability",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "contact_label",
          "args": null,
          "storageKey": null
        }
      ]
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
        v2,
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": v3
        },
        {
          "kind": "InlineFragment",
          "type": "ExternalPartner",
          "selections": v3
        }
      ]
    },
    v2
  ]
};
})();
(node as any).hash = '70c2bbd6d5d027cd769a67ca7a18b655';
export default node;
