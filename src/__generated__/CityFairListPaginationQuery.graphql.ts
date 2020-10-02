/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash b2ec75f9ace3de0f54ce7426ae7eb6e5 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CityFairListPaginationQueryVariables = {
    count: number;
    cursor?: string | null;
    citySlug: string;
};
export type CityFairListPaginationQueryResponse = {
    readonly city: {
        readonly " $fragmentRefs": FragmentRefs<"CityFairList_city">;
    } | null;
};
export type CityFairListPaginationQuery = {
    readonly response: CityFairListPaginationQueryResponse;
    readonly variables: CityFairListPaginationQueryVariables;
};



/*
query CityFairListPaginationQuery(
  $count: Int!
  $cursor: String
  $citySlug: String!
) {
  city(slug: $citySlug) {
    ...CityFairList_city_1G22uz
  }
}

fragment CityFairList_city_1G22uz on City {
  slug
  fairs: fairsConnection(first: $count, after: $cursor, status: CURRENT, sort: START_AT_ASC) {
    edges {
      node {
        internalID
        name
        exhibition_period: exhibitionPeriod
        counts {
          partners
        }
        location {
          coordinates {
            lat
            lng
          }
          id
        }
        image {
          image_url: imageURL
          aspect_ratio: aspectRatio
          url
        }
        profile {
          icon {
            internalID
            href
            height
            width
            url(version: "square140")
          }
          id
          slug
          name
        }
        start_at: startAt
        end_at: endAt
        id
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
  "name": "slug",
  "storageKey": null
},
v5 = [
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
    "value": "START_AT_ASC"
  },
  {
    "kind": "Literal",
    "name": "status",
    "value": "CURRENT"
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CityFairListPaginationQuery",
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
            "name": "CityFairList_city"
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
    "name": "CityFairListPaginationQuery",
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
          {
            "alias": "fairs",
            "args": (v5/*: any*/),
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
                      (v6/*: any*/),
                      (v7/*: any*/),
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
                          (v8/*: any*/)
                        ],
                        "storageKey": null
                      },
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
                              (v6/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "href",
                                "storageKey": null
                              },
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
                          (v8/*: any*/),
                          (v4/*: any*/),
                          (v7/*: any*/)
                        ],
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
                      (v8/*: any*/),
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
          },
          {
            "alias": "fairs",
            "args": (v5/*: any*/),
            "filters": [
              "status",
              "sort"
            ],
            "handle": "connection",
            "key": "CityFairList_fairs",
            "kind": "LinkedHandle",
            "name": "fairsConnection"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "b2ec75f9ace3de0f54ce7426ae7eb6e5",
    "metadata": {},
    "name": "CityFairListPaginationQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'adb3f7c25528f635d78a6440fb4eab9e';
export default node;
