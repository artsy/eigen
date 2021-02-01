/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type GlobalMap_viewer = {
    readonly city: {
        readonly name: string;
        readonly slug: string;
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
                readonly partner: {
                    readonly name?: string | null;
                    readonly type?: string | null;
                } | null;
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
                    readonly partner: {
                        readonly name?: string | null;
                        readonly type?: string | null;
                        readonly profile?: {
                            readonly image: {
                                readonly url: string | null;
                            } | null;
                        } | null;
                    } | null;
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
                    readonly partner: {
                        readonly name?: string | null;
                        readonly type?: string | null;
                        readonly profile?: {
                            readonly image: {
                                readonly url: string | null;
                            } | null;
                        } | null;
                    } | null;
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
                        readonly partners: number | null;
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
    readonly " $refType": "GlobalMap_viewer";
};
export type GlobalMap_viewer$data = GlobalMap_viewer;
export type GlobalMap_viewer$key = {
    readonly " $data"?: GlobalMap_viewer$data;
    readonly " $fragmentRefs": FragmentRefs<"GlobalMap_viewer">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "LatLng",
  "kind": "LinkedField",
  "name": "coordinates",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lat",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lng",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isStubShow",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v8 = {
  "alias": "is_followed",
  "args": null,
  "kind": "ScalarField",
  "name": "isFollowed",
  "storageKey": null
},
v9 = {
  "alias": "exhibition_period",
  "args": null,
  "kind": "ScalarField",
  "name": "exhibitionPeriod",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v11 = {
  "alias": "cover_image",
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "coverImage",
  "plural": false,
  "selections": [
    (v10/*: any*/)
  ],
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "Location",
  "kind": "LinkedField",
  "name": "location",
  "plural": false,
  "selections": [
    (v2/*: any*/)
  ],
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v14 = {
  "alias": "start_at",
  "args": null,
  "kind": "ScalarField",
  "name": "startAt",
  "storageKey": null
},
v15 = {
  "alias": "end_at",
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
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
    "alias": null,
    "args": null,
    "concreteType": "ShowEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "node",
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
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "partner",
            "plural": false,
            "selections": [
              {
                "kind": "InlineFragment",
                "selections": [
                  (v0/*: any*/),
                  (v13/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Profile",
                    "kind": "LinkedField",
                    "name": "profile",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "image",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "square"
                              }
                            ],
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": "url(version:\"square\")"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "type": "Partner",
                "abstractKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "citySlug"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "maxInt"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "GlobalMap_viewer",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "citySlug"
        }
      ],
      "concreteType": "City",
      "kind": "LinkedField",
      "name": "city",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "CitySponsoredContent",
          "kind": "LinkedField",
          "name": "sponsoredContent",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "introText",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "artGuideUrl",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Show",
              "kind": "LinkedField",
              "name": "featuredShows",
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
                  "alias": null,
                  "args": null,
                  "concreteType": null,
                  "kind": "LinkedField",
                  "name": "partner",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "InlineFragment",
                      "selections": [
                        (v0/*: any*/),
                        (v13/*: any*/)
                      ],
                      "type": "Partner",
                      "abstractKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": "shows",
              "args": [
                {
                  "kind": "Literal",
                  "name": "first",
                  "value": 1
                },
                (v16/*: any*/)
              ],
              "concreteType": "ShowConnection",
              "kind": "LinkedField",
              "name": "showsConnection",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "totalCount",
                  "storageKey": null
                }
              ],
              "storageKey": "showsConnection(first:1,sort:\"START_AT_ASC\")"
            }
          ],
          "storageKey": null
        },
        {
          "alias": "upcomingShows",
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
          "kind": "LinkedField",
          "name": "showsConnection",
          "plural": false,
          "selections": (v19/*: any*/),
          "storageKey": null
        },
        {
          "alias": "shows",
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
          "kind": "LinkedField",
          "name": "showsConnection",
          "plural": false,
          "selections": (v19/*: any*/),
          "storageKey": null
        },
        {
          "alias": "fairs",
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
          "kind": "LinkedField",
          "name": "fairsConnection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "FairEdge",
              "kind": "LinkedField",
              "name": "edges",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Fair",
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    (v4/*: any*/),
                    (v1/*: any*/),
                    (v0/*: any*/),
                    (v9/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "FairCounts",
                      "kind": "LinkedField",
                      "name": "counts",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "partners",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    (v12/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Image",
                      "kind": "LinkedField",
                      "name": "image",
                      "plural": false,
                      "selections": [
                        {
                          "alias": "image_url",
                          "args": null,
                          "kind": "ScalarField",
                          "name": "imageURL",
                          "storageKey": null
                        },
                        {
                          "alias": "aspect_ratio",
                          "args": null,
                          "kind": "ScalarField",
                          "name": "aspectRatio",
                          "storageKey": null
                        },
                        (v10/*: any*/)
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Profile",
                      "kind": "LinkedField",
                      "name": "profile",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Image",
                          "kind": "LinkedField",
                          "name": "icon",
                          "plural": false,
                          "selections": [
                            (v3/*: any*/),
                            (v7/*: any*/),
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "height",
                              "storageKey": null
                            },
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "width",
                              "storageKey": null
                            },
                            {
                              "alias": null,
                              "args": [
                                {
                                  "kind": "Literal",
                                  "name": "version",
                                  "value": "square140"
                                }
                              ],
                              "kind": "ScalarField",
                              "name": "url",
                              "storageKey": "url(version:\"square140\")"
                            }
                          ],
                          "storageKey": null
                        },
                        (v4/*: any*/),
                        (v1/*: any*/),
                        (v0/*: any*/)
                      ],
                      "storageKey": null
                    },
                    (v14/*: any*/),
                    (v15/*: any*/)
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();
(node as any).hash = '53446e45f521a86c17c04ad7873626f4';
export default node;
