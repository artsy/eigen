/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _CitySavedList_viewer$ref: unique symbol;
export type CitySavedList_viewer$ref = typeof _CitySavedList_viewer$ref;
export type CitySavedList_viewer = {
    readonly city: ({
        readonly name: string | null;
    }) | null;
    readonly me: ({
        readonly followsAndSaves: ({
            readonly shows: ({
                readonly edges: ReadonlyArray<({
                    readonly node: ({
                        readonly id: string;
                        readonly _id: string;
                        readonly __id: string;
                        readonly name: string | null;
                        readonly status: string | null;
                        readonly href: string | null;
                        readonly is_followed: boolean | null;
                        readonly exhibition_period: string | null;
                        readonly cover_image: ({
                            readonly url: string | null;
                        }) | null;
                        readonly location: ({
                            readonly coordinates: ({
                                readonly lat: number | null;
                                readonly lng: number | null;
                            }) | null;
                        }) | null;
                        readonly type: string | null;
                        readonly start_at: string | null;
                        readonly end_at: string | null;
                        readonly partner: ({
                            readonly name?: string | null;
                            readonly type?: string | null;
                        }) | null;
                    }) | null;
                }) | null> | null;
            }) | null;
        }) | null;
    }) | null;
    readonly " $refType": CitySavedList_viewer$ref;
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
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "type",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "CitySavedList_viewer",
  "type": "Viewer",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "me",
          "followsAndSaves",
          "shows"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 20
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": ""
    },
    {
      "kind": "RootArgument",
      "name": "citySlug",
      "type": "String"
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "city",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "citySlug",
          "type": "String"
        }
      ],
      "concreteType": "City",
      "plural": false,
      "selections": [
        v0
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "me",
      "storageKey": null,
      "args": null,
      "concreteType": "Me",
      "plural": false,
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
              "alias": "shows",
              "name": "__CitySavedList_shows_connection",
              "storageKey": null,
              "args": [
                {
                  "kind": "Variable",
                  "name": "city",
                  "variableName": "citySlug",
                  "type": "String"
                },
                {
                  "kind": "Literal",
                  "name": "dayThreshold",
                  "value": 30,
                  "type": "Int"
                },
                {
                  "kind": "Literal",
                  "name": "status",
                  "value": "CURRENT",
                  "type": "EventStatus"
                }
              ],
              "concreteType": "FollowedShowConnection",
              "plural": false,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "edges",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "FollowedShowEdge",
                  "plural": true,
                  "selections": [
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "node",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "Show",
                      "plural": false,
                      "selections": [
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
                          "name": "id",
                          "args": null,
                          "storageKey": null
                        },
                        v1,
                        v0,
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "status",
                          "args": null,
                          "storageKey": null
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
                          "name": "is_followed",
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
                            }
                          ]
                        },
                        {
                          "kind": "LinkedField",
                          "alias": null,
                          "name": "location",
                          "storageKey": null,
                          "args": null,
                          "concreteType": "Location",
                          "plural": false,
                          "selections": [
                            {
                              "kind": "LinkedField",
                              "alias": null,
                              "name": "coordinates",
                              "storageKey": null,
                              "args": null,
                              "concreteType": "LatLng",
                              "plural": false,
                              "selections": [
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "name": "lat",
                                  "args": null,
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "name": "lng",
                                  "args": null,
                                  "storageKey": null
                                }
                              ]
                            },
                            v1
                          ]
                        },
                        v2,
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
                              "selections": [
                                v0,
                                v2
                              ]
                            }
                          ]
                        },
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
    }
  ]
};
})();
(node as any).hash = 'b79bd30e4b06855a212da4b77392003f';
export default node;
