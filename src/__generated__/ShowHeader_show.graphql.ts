/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _ShowHeader_show$ref: unique symbol;
export type ShowHeader_show$ref = typeof _ShowHeader_show$ref;
export type ShowHeader_show = {
    readonly id: string;
    readonly _id: string;
    readonly __id: string;
    readonly name: string | null;
    readonly press_release: string | null;
    readonly is_followed: boolean | null;
    readonly exhibition_period: string | null;
    readonly status: string | null;
    readonly partner: ({
        readonly name?: string | null;
        readonly id?: string;
        readonly href?: string | null;
    }) | null;
    readonly images: ReadonlyArray<({
        readonly url: string | null;
        readonly aspect_ratio: number;
    }) | null> | null;
    readonly followedArtists: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly artist: ({
                    readonly name: string | null;
                    readonly href: string | null;
                    readonly id: string;
                    readonly _id: string;
                }) | null;
            }) | null;
        }) | null> | null;
    }) | null;
    readonly artists: ReadonlyArray<({
        readonly name: string | null;
        readonly href: string | null;
        readonly id: string;
        readonly _id: string;
    }) | null> | null;
    readonly " $refType": ShowHeader_show$ref;
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
  "name": "__id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "_id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v5 = [
  v2,
  v4,
  v0,
  v3,
  v1
];
return {
  "kind": "Fragment",
  "name": "ShowHeader_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "exhibition_period",
      "args": null,
      "storageKey": null
    },
    v0,
    v1,
    v2,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "press_release",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_followed",
      "args": null,
      "storageKey": null
    },
    v3,
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
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        v1,
        {
          "kind": "InlineFragment",
          "type": "ExternalPartner",
          "selections": [
            v2
          ]
        },
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": [
            v2,
            v0,
            v4
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "images",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": true,
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
      "kind": "LinkedField",
      "alias": null,
      "name": "followedArtists",
      "storageKey": "followedArtists(first:2)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 2,
          "type": "Int"
        }
      ],
      "concreteType": "ShowFollowArtistConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ShowFollowArtistEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "ShowFollowArtist",
              "plural": false,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "artist",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Artist",
                  "plural": false,
                  "selections": v5
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": v5
    }
  ]
};
})();
(node as any).hash = 'dde646b2826d130b631c77895bca57af';
export default node;
