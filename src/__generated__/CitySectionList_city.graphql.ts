/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _CitySectionList_city$ref: unique symbol;
export type CitySectionList_city$ref = typeof _CitySectionList_city$ref;
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
    readonly " $refType": CitySectionList_city$ref;
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
  "name": "type",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "CitySectionList_city",
  "type": "City",
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
      "kind": "LocalArgument",
      "name": "partnerType",
      "type": "PartnerShowPartnerType",
      "defaultValue": null
    },
    {
      "kind": "LocalArgument",
      "name": "status",
      "type": "EventStatus",
      "defaultValue": null
    },
    {
      "kind": "LocalArgument",
      "name": "dayThreshold",
      "type": "Int",
      "defaultValue": null
    },
    {
      "kind": "LocalArgument",
      "name": "sort",
      "type": "ShowSorts",
      "defaultValue": "PARTNER_ASC"
    }
  ],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": "shows",
      "name": "__CitySectionList_shows_connection",
      "storageKey": null,
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
      "plural": false,
      "selections": [
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
        },
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
                  "name": "slug",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "internalID",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "isStubShow",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": "is_followed",
                  "name": "isFollowed",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": "start_at",
                  "name": "startAt",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": "end_at",
                  "name": "endAt",
                  "args": null,
                  "storageKey": null
                },
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
                (v1/*: any*/),
                (v0/*: any*/),
                {
                  "kind": "LinkedField",
                  "alias": "cover_image",
                  "name": "coverImage",
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
                  "alias": "exhibition_period",
                  "name": "exhibitionPeriod",
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
                    {
                      "kind": "InlineFragment",
                      "type": "Partner",
                      "selections": [
                        (v0/*: any*/),
                        (v1/*: any*/),
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
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'a01105e702fac08d027d63615d4d59ec';
export default node;
