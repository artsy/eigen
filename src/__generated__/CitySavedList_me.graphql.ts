/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CitySavedList_me = {
    readonly followsAndSaves: {
        readonly shows: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly slug: string;
                    readonly internalID: string;
                    readonly id: string;
                    readonly name: string | null;
                    readonly isStubShow: boolean | null;
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
    } | null;
    readonly " $refType": "CitySavedList_me";
};
export type CitySavedList_me$data = CitySavedList_me;
export type CitySavedList_me$key = {
    readonly " $data"?: CitySavedList_me$data;
    readonly " $fragmentRefs": FragmentRefs<"CitySavedList_me">;
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
  "name": "type",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "citySlug"
    },
    {
      "defaultValue": 20,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": "",
      "kind": "LocalArgument",
      "name": "cursor"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "followsAndSaves",
          "shows"
        ]
      }
    ]
  },
  "name": "CitySavedList_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "FollowsAndSaves",
      "kind": "LinkedField",
      "name": "followsAndSaves",
      "plural": false,
      "selections": [
        {
          "alias": "shows",
          "args": [
            {
              "kind": "Variable",
              "name": "city",
              "variableName": "citySlug"
            },
            {
              "kind": "Literal",
              "name": "status",
              "value": "RUNNING_AND_UPCOMING"
            }
          ],
          "concreteType": "FollowedShowConnection",
          "kind": "LinkedField",
          "name": "__CitySavedList_shows_connection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "FollowedShowEdge",
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
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "slug",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "internalID",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "id",
                      "storageKey": null
                    },
                    (v0/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "isStubShow",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "status",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "href",
                      "storageKey": null
                    },
                    {
                      "alias": "is_followed",
                      "args": null,
                      "kind": "ScalarField",
                      "name": "isFollowed",
                      "storageKey": null
                    },
                    {
                      "alias": "exhibition_period",
                      "args": null,
                      "kind": "ScalarField",
                      "name": "exhibitionPeriod",
                      "storageKey": null
                    },
                    {
                      "alias": "cover_image",
                      "args": null,
                      "concreteType": "Image",
                      "kind": "LinkedField",
                      "name": "coverImage",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "url",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Location",
                      "kind": "LinkedField",
                      "name": "location",
                      "plural": false,
                      "selections": [
                        {
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
                        }
                      ],
                      "storageKey": null
                    },
                    (v1/*: any*/),
                    {
                      "alias": "start_at",
                      "args": null,
                      "kind": "ScalarField",
                      "name": "startAt",
                      "storageKey": null
                    },
                    {
                      "alias": "end_at",
                      "args": null,
                      "kind": "ScalarField",
                      "name": "endAt",
                      "storageKey": null
                    },
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
                            (v1/*: any*/),
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
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "__typename",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "cursor",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PageInfo",
              "kind": "LinkedField",
              "name": "pageInfo",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "endCursor",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "hasNextPage",
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
  "type": "Me",
  "abstractKey": null
};
})();
(node as any).hash = '02a4221db6aa8965960ce92ed3675bc0';
export default node;
