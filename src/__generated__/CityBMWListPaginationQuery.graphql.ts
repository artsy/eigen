/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash ccd6fbb80cfb6750069b2c0535f21538 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CityBMWListPaginationQueryVariables = {
    count: number;
    cursor?: string | null;
    citySlug: string;
};
export type CityBMWListPaginationQueryResponse = {
    readonly city: {
        readonly " $fragmentRefs": FragmentRefs<"CityBMWList_city">;
    } | null;
};
export type CityBMWListPaginationQuery = {
    readonly response: CityBMWListPaginationQueryResponse;
    readonly variables: CityBMWListPaginationQueryVariables;
};



/*
query CityBMWListPaginationQuery(
  $count: Int!
  $cursor: String
  $citySlug: String!
) {
  city(slug: $citySlug) {
    ...CityBMWList_city_1G22uz
  }
}

fragment CityBMWList_city_1G22uz on City {
  name
  slug
  sponsoredContent {
    shows: showsConnection(first: $count, status: RUNNING, after: $cursor, sort: PARTNER_ASC) {
      edges {
        node {
          slug
          internalID
          id
          name
          status
          href
          is_followed: isFollowed
          isStubShow
          exhibition_period: exhibitionPeriod
          cover_image: coverImage {
            url
          }
          location {
            coordinates {
              lat
              lng
            }
            id
          }
          type
          start_at: startAt
          end_at: endAt
          partner {
            __typename
            ... on Partner {
              name
              type
              profile {
                image {
                  url(version: "square")
                }
                id
              }
            }
            ... on Node {
              __isNode: __typename
              id
            }
            ... on ExternalPartner {
              id
            }
          }
          __typename
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "citySlug"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cursor"
},
v3 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "citySlug"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v6 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
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
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v10 = [
  (v7/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CityBMWListPaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "City",
        "kind": "LinkedField",
        "name": "city",
        "plural": false,
        "selections": [
          {
            "args": [
              {
                "kind": "Variable",
                "name": "count",
                "variableName": "count"
              },
              {
                "kind": "Variable",
                "name": "cursor",
                "variableName": "cursor"
              }
            ],
            "kind": "FragmentSpread",
            "name": "CityBMWList_city"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "CityBMWListPaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "City",
        "kind": "LinkedField",
        "name": "city",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "CitySponsoredContent",
            "kind": "LinkedField",
            "name": "sponsoredContent",
            "plural": false,
            "selections": [
              {
                "alias": "shows",
                "args": (v6/*: any*/),
                "concreteType": "ShowConnection",
                "kind": "LinkedField",
                "name": "showsConnection",
                "plural": false,
                "selections": [
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
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "internalID",
                            "storageKey": null
                          },
                          (v7/*: any*/),
                          (v4/*: any*/),
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
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isStubShow",
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
                              },
                              (v7/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v8/*: any*/),
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
                              (v9/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v4/*: any*/),
                                  (v8/*: any*/),
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
                                      },
                                      (v7/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "type": "Partner",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": (v10/*: any*/),
                                "type": "Node",
                                "abstractKey": "__isNode"
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": (v10/*: any*/),
                                "type": "ExternalPartner",
                                "abstractKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v9/*: any*/)
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
              },
              {
                "alias": "shows",
                "args": (v6/*: any*/),
                "filters": [
                  "status",
                  "sort"
                ],
                "handle": "connection",
                "key": "CityBMWList_shows",
                "kind": "LinkedHandle",
                "name": "showsConnection"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "ccd6fbb80cfb6750069b2c0535f21538",
    "metadata": {},
    "name": "CityBMWListPaginationQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '03218d5204e271d08f4156a09ded1d0e';
export default node;
