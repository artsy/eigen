/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _FairHeader_fair$ref: unique symbol;
export type FairHeader_fair$ref = typeof _FairHeader_fair$ref;
export type FairHeader_fair = {
    readonly id: string;
    readonly name: string | null;
    readonly exhibitors_grouped_by_name: ReadonlyArray<({
        readonly exhibitors: ReadonlyArray<string | null> | null;
    }) | null> | null;
    readonly counts: ({
        readonly artists: any | null;
        readonly partners: any | null;
    }) | null;
    readonly artists_names: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly name: string | null;
            }) | null;
        }) | null> | null;
    }) | null;
    readonly image: ({
        readonly image_url: string | null;
        readonly aspect_ratio: number;
        readonly url: string | null;
    }) | null;
    readonly profile: ({
        readonly icon: ({
            readonly id: string | null;
            readonly href: string | null;
            readonly height: number | null;
            readonly width: number | null;
            readonly url: string | null;
        }) | null;
        readonly name: string | null;
    }) | null;
    readonly start_at: string | null;
    readonly end_at: string | null;
    readonly " $refType": FairHeader_fair$ref;
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
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "FairHeader_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    v0,
    v1,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "exhibitors_grouped_by_name",
      "storageKey": null,
      "args": null,
      "concreteType": "FairExhibitorsGroup",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "exhibitors",
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
      "concreteType": "FairCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artists",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "partners",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "artists_names",
      "name": "artists",
      "storageKey": "artists(first:2)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 2,
          "type": "Int"
        }
      ],
      "concreteType": "ArtistConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtistEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Artist",
              "plural": false,
              "selections": [
                v1,
                v2
              ]
            }
          ]
        }
      ]
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
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "image_url",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "aspect_ratio",
          "args": null,
          "storageKey": null
        },
        v3
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "profile",
      "storageKey": null,
      "args": null,
      "concreteType": "Profile",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "icon",
          "storageKey": null,
          "args": null,
          "concreteType": "Image",
          "plural": false,
          "selections": [
            v0,
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
              "name": "height",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "width",
              "args": null,
              "storageKey": null
            },
            v3
          ]
        },
        v1,
        v2
      ]
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
    },
    v2
  ]
};
})();
(node as any).hash = '4c7aefd7f3af68346b29d9a5aaefb0c8';
export default node;
