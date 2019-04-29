/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _Fairs_me$ref: unique symbol;
export type Fairs_me$ref = typeof _Fairs_me$ref;
export type Fairs_me = {
    readonly followsAndSaves: ({
        readonly fairs: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly profile: ({
                        readonly gravityID: string;
                        readonly is_followed: boolean | null;
                        readonly id: string;
                    }) | null;
                    readonly exhibition_period: string | null;
                    readonly name: string | null;
                    readonly counts: ({
                        readonly partners: any | null;
                    }) | null;
                    readonly href: string | null;
                    readonly image: ({
                        readonly url: string | null;
                    }) | null;
                    readonly start_at: string | null;
                    readonly end_at: string | null;
                }) | null;
            }) | null> | null;
        }) | null;
    }) | null;
    readonly " $refType": Fairs_me$ref;
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
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Fairs_me",
  "type": "Me",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "followsAndSaves",
          "fairs"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 10
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": ""
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "followsAndSaves",
      "storageKey": null,
      "args": null,
      "concreteType": "FollowsAndSaves",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "fairs",
          "name": "__SavedFairs_fairs_connection",
          "storageKey": null,
          "args": null,
          "concreteType": "FollowedFairConnection",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "FollowedFairEdge",
              "plural": true,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "node",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Fair",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "href",
                      "args": null,
                      "storageKey": null
                    },
                    v0,
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
                      "name": "name",
                      "args": null,
                      "storageKey": null
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
                          "name": "partners",
                          "args": null,
                          "storageKey": null
                        }
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
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "gravityID",
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
                        v0,
                        v1
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
                          "name": "url",
                          "args": null,
                          "storageKey": null
                        }
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
                    v1,
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "__typename",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "cursor",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "pageInfo",
              "storageKey": null,
              "args": null,
              "concreteType": "PageInfo",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "endCursor",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "hasNextPage",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    },
    v1
  ]
};
})();
(node as any).hash = '5945c93f34f13346d986298354d5f992';
export default node;
