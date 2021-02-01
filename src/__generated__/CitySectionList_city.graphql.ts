/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CitySectionList_city = {
    readonly name: string | null;
    readonly shows: {
        readonly pageInfo: {
            readonly endCursor: string | null;
            readonly hasNextPage: boolean;
        };
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly slug: string;
                readonly internalID: string;
                readonly isStubShow: boolean | null;
                readonly is_followed: boolean | null;
                readonly start_at: string | null;
                readonly end_at: string | null;
                readonly status: string | null;
                readonly href: string | null;
                readonly type: string | null;
                readonly name: string | null;
                readonly cover_image: {
                    readonly url: string | null;
                } | null;
                readonly exhibition_period: string | null;
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
    readonly " $refType": "CitySectionList_city";
};
export type CitySectionList_city$data = CitySectionList_city;
export type CitySectionList_city$key = {
    readonly " $data"?: CitySectionList_city$data;
    readonly " $fragmentRefs": FragmentRefs<"CitySectionList_city">;
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
      "defaultValue": 20,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": "",
      "kind": "LocalArgument",
      "name": "cursor"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "dayThreshold"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "partnerType"
    },
    {
      "defaultValue": "PARTNER_ASC",
      "kind": "LocalArgument",
      "name": "sort"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "status"
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
          "shows"
        ]
      }
    ]
  },
  "name": "CitySectionList_city",
  "selections": [
    (v0/*: any*/),
    {
      "alias": "shows",
      "args": [
        {
          "kind": "Variable",
          "name": "dayThreshold",
          "variableName": "dayThreshold"
        },
        {
          "kind": "Literal",
          "name": "includeStubShows",
          "value": true
        },
        {
          "kind": "Variable",
          "name": "partnerType",
          "variableName": "partnerType"
        },
        {
          "kind": "Variable",
          "name": "sort",
          "variableName": "sort"
        },
        {
          "kind": "Variable",
          "name": "status",
          "variableName": "status"
        }
      ],
      "concreteType": "ShowConnection",
      "kind": "LinkedField",
      "name": "__CitySectionList_shows_connection",
      "plural": false,
      "selections": [
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
        },
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
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
                  "name": "isStubShow",
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
                (v1/*: any*/),
                (v0/*: any*/),
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
                  "alias": "exhibition_period",
                  "args": null,
                  "kind": "ScalarField",
                  "name": "exhibitionPeriod",
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "City",
  "abstractKey": null
};
})();
(node as any).hash = 'a01105e702fac08d027d63615d4d59ec';
export default node;
