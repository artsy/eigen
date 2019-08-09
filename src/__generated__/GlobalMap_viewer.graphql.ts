/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _GlobalMap_viewer$ref: unique symbol;
export type GlobalMap_viewer$ref = typeof _GlobalMap_viewer$ref;
export type GlobalMap_viewer = {
    readonly city: {
        readonly name: string | null;
        readonly slug: string | null;
        readonly coordinates: {
            readonly lat: number | null;
            readonly lng: number | null;
        } | null;
        readonly sponsoredContent: {
            readonly introText: string | null;
            readonly artGuideUrl: string | null;
            readonly featuredShows: ReadonlyArray<{
                readonly slug: string;
                readonly internalID: string;
                readonly id: string;
                readonly name: string | null;
                readonly status: string | null;
                readonly isStubShow: boolean | null;
                readonly href: string | null;
                readonly is_followed: boolean | null;
                readonly exhibition_period: string | null;
                readonly cover_image: {
                    readonly url: string | null;
                } | null;
                readonly location: {
                    readonly coordinates: {
                        readonly lat: number | null;
                        readonly lng: number | null;
                    } | null;
                } | null;
                readonly type: string | null;
                readonly start_at: string | null;
                readonly end_at: string | null;
                readonly partner: ({
                    readonly name?: string | null;
                    readonly type?: string | null;
                } & ({
                    readonly name: string | null;
                    readonly type: string | null;
                } | {
                    /*This will never be '% other', but we need some
                    value in case none of the concrete values match.*/
                    readonly __typename: "%other";
                })) | null;
            } | null> | null;
            readonly shows: {
                readonly totalCount: number | null;
            } | null;
        } | null;
        readonly upcomingShows: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly slug: string;
                    readonly internalID: string;
                    readonly id: string;
                    readonly isStubShow: boolean | null;
                    readonly name: string | null;
                    readonly status: string | null;
                    readonly href: string | null;
                    readonly is_followed: boolean | null;
                    readonly exhibition_period: string | null;
                    readonly cover_image: {
                        readonly url: string | null;
                    } | null;
                    readonly location: {
                        readonly coordinates: {
                            readonly lat: number | null;
                            readonly lng: number | null;
                        } | null;
                    } | null;
                    readonly type: string | null;
                    readonly start_at: string | null;
                    readonly end_at: string | null;
                    readonly partner: ({
                        readonly name?: string | null;
                        readonly type?: string | null;
                        readonly profile?: {
                            readonly image: {
                                readonly url: string | null;
                            } | null;
                        } | null;
                    } & ({
                        readonly name: string | null;
                        readonly type: string | null;
                        readonly profile: {
                            readonly image: {
                                readonly url: string | null;
                            } | null;
                        } | null;
                    } | {
                        /*This will never be '% other', but we need some
                        value in case none of the concrete values match.*/
                        readonly __typename: "%other";
                    })) | null;
                } | null;
            } | null> | null;
        } | null;
        readonly shows: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly slug: string;
                    readonly internalID: string;
                    readonly id: string;
                    readonly isStubShow: boolean | null;
                    readonly name: string | null;
                    readonly status: string | null;
                    readonly href: string | null;
                    readonly is_followed: boolean | null;
                    readonly exhibition_period: string | null;
                    readonly cover_image: {
                        readonly url: string | null;
                    } | null;
                    readonly location: {
                        readonly coordinates: {
                            readonly lat: number | null;
                            readonly lng: number | null;
                        } | null;
                    } | null;
                    readonly type: string | null;
                    readonly start_at: string | null;
                    readonly end_at: string | null;
                    readonly partner: ({
                        readonly name?: string | null;
                        readonly type?: string | null;
                        readonly profile?: {
                            readonly image: {
                                readonly url: string | null;
                            } | null;
                        } | null;
                    } & ({
                        readonly name: string | null;
                        readonly type: string | null;
                        readonly profile: {
                            readonly image: {
                                readonly url: string | null;
                            } | null;
                        } | null;
                    } | {
                        /*This will never be '% other', but we need some
                        value in case none of the concrete values match.*/
                        readonly __typename: "%other";
                    })) | null;
                } | null;
            } | null> | null;
        } | null;
        readonly fairs: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                    readonly slug: string;
                    readonly name: string | null;
                    readonly exhibition_period: string | null;
                    readonly counts: {
                        readonly partners: any | null;
                    } | null;
                    readonly location: {
                        readonly coordinates: {
                            readonly lat: number | null;
                            readonly lng: number | null;
                        } | null;
                    } | null;
                    readonly image: {
                        readonly image_url: string | null;
                        readonly aspect_ratio: number;
                        readonly url: string | null;
                    } | null;
                    readonly profile: {
                        readonly icon: {
                            readonly internalID: string | null;
                            readonly href: string | null;
                            readonly height: number | null;
                            readonly width: number | null;
                            readonly url: string | null;
                        } | null;
                        readonly id: string;
                        readonly slug: string;
                        readonly name: string | null;
                    } | null;
                    readonly start_at: string | null;
                    readonly end_at: string | null;
                } | null;
            } | null> | null;
        } | null;
    } | null;
    readonly " $refType": GlobalMap_viewer$ref;
};



const node: ReaderFragment = (function(){
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
  "name": "slug",
  "args": null,
  "storageKey": null
},
v2 = {
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
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "status",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isStubShow",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": "is_followed",
  "name": "isFollowed",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": "exhibition_period",
  "name": "exhibitionPeriod",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "LinkedField",
  "alias": "cover_image",
  "name": "coverImage",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": [
    (v10/*: any*/)
  ]
},
v12 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "location",
  "storageKey": null,
  "args": null,
  "concreteType": "Location",
  "plural": false,
  "selections": [
    (v2/*: any*/)
  ]
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "type",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": "start_at",
  "name": "startAt",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": "end_at",
  "name": "endAt",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "Literal",
  "name": "sort",
  "value": "START_AT_ASC"
},
v17 = {
  "kind": "Variable",
  "name": "first",
  "variableName": "maxInt"
},
v18 = {
  "kind": "Literal",
  "name": "includeStubShows",
  "value": true
},
v19 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "edges",
    "storageKey": null,
    "args": null,
    "concreteType": "ShowEdge",
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
          (v1/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v6/*: any*/),
          (v0/*: any*/),
          (v5/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
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
                "selections": [
                  (v0/*: any*/),
                  (v13/*: any*/),
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
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "square"
                              }
                            ],
                            "storageKey": "url(version:\"square\")"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Fragment",
  "name": "GlobalMap_viewer",
  "type": "Viewer",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "citySlug",
      "type": "String!",
      "defaultValue": null
    },
    {
      "kind": "LocalArgument",
      "name": "maxInt",
      "type": "Int!",
      "defaultValue": null
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
          "variableName": "citySlug"
        }
      ],
      "concreteType": "City",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "sponsoredContent",
          "storageKey": null,
          "args": null,
          "concreteType": "CitySponsoredContent",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "introText",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "artGuideUrl",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "featuredShows",
              "storageKey": null,
              "args": null,
              "concreteType": "Show",
              "plural": true,
              "selections": [
                (v1/*: any*/),
                (v3/*: any*/),
                (v4/*: any*/),
                (v0/*: any*/),
                (v5/*: any*/),
                (v6/*: any*/),
                (v7/*: any*/),
                (v8/*: any*/),
                (v9/*: any*/),
                (v11/*: any*/),
                (v12/*: any*/),
                (v13/*: any*/),
                (v14/*: any*/),
                (v15/*: any*/),
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
                      "selections": [
                        (v0/*: any*/),
                        (v13/*: any*/)
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "kind": "LinkedField",
              "alias": "shows",
              "name": "showsConnection",
              "storageKey": "showsConnection(first:1,sort:\"START_AT_ASC\")",
              "args": [
                {
                  "kind": "Literal",
                  "name": "first",
                  "value": 1
                },
                (v16/*: any*/)
              ],
              "concreteType": "ShowConnection",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "totalCount",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": "upcomingShows",
          "name": "showsConnection",
          "storageKey": null,
          "args": [
            {
              "kind": "Literal",
              "name": "dayThreshold",
              "value": 14
            },
            (v17/*: any*/),
            (v18/*: any*/),
            (v16/*: any*/),
            {
              "kind": "Literal",
              "name": "status",
              "value": "UPCOMING"
            }
          ],
          "concreteType": "ShowConnection",
          "plural": false,
          "selections": (v19/*: any*/)
        },
        {
          "kind": "LinkedField",
          "alias": "shows",
          "name": "showsConnection",
          "storageKey": null,
          "args": [
            (v17/*: any*/),
            (v18/*: any*/),
            {
              "kind": "Literal",
              "name": "sort",
              "value": "PARTNER_ASC"
            },
            {
              "kind": "Literal",
              "name": "status",
              "value": "RUNNING"
            }
          ],
          "concreteType": "ShowConnection",
          "plural": false,
          "selections": (v19/*: any*/)
        },
        {
          "kind": "LinkedField",
          "alias": "fairs",
          "name": "fairsConnection",
          "storageKey": null,
          "args": [
            (v17/*: any*/),
            (v16/*: any*/),
            {
              "kind": "Literal",
              "name": "status",
              "value": "CURRENT"
            }
          ],
          "concreteType": "FairConnection",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "FairEdge",
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
                    (v4/*: any*/),
                    (v1/*: any*/),
                    (v0/*: any*/),
                    (v9/*: any*/),
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
                    (v12/*: any*/),
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
                          "alias": "image_url",
                          "name": "imageURL",
                          "args": null,
                          "storageKey": null
                        },
                        {
                          "kind": "ScalarField",
                          "alias": "aspect_ratio",
                          "name": "aspectRatio",
                          "args": null,
                          "storageKey": null
                        },
                        (v10/*: any*/)
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
                            (v3/*: any*/),
                            (v7/*: any*/),
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
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "name": "url",
                              "args": [
                                {
                                  "kind": "Literal",
                                  "name": "version",
                                  "value": "square140"
                                }
                              ],
                              "storageKey": "url(version:\"square140\")"
                            }
                          ]
                        },
                        (v4/*: any*/),
                        (v1/*: any*/),
                        (v0/*: any*/)
                      ]
                    },
                    (v14/*: any*/),
                    (v15/*: any*/)
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '7d24d12a8e10b27bf6528932b2abe624';
export default node;
