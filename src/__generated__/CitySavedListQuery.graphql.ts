/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { CitySavedList_viewer$ref } from "./CitySavedList_viewer.graphql";
export type CitySavedListQueryVariables = {
    readonly count: number;
    readonly cursor?: string | null;
    readonly citySlug: string;
};
export type CitySavedListQueryResponse = {
    readonly viewer: ({
        readonly " $fragmentRefs": CitySavedList_viewer$ref;
    }) | null;
};
export type CitySavedListQuery = {
    readonly response: CitySavedListQueryResponse;
    readonly variables: CitySavedListQueryVariables;
};



/*
query CitySavedListQuery(
  $count: Int!
  $cursor: String
  $citySlug: String!
) {
  viewer {
    ...CitySavedList_viewer_40VqxQ
  }
}

fragment CitySavedList_viewer_40VqxQ on Viewer {
  city(slug: $citySlug) {
    name
  }
  me {
    followsAndSaves {
      shows(first: $count, status: CURRENT, dayThreshold: 30, city: $citySlug, after: $cursor) {
        edges {
          node {
            id
            _id
            __id
            name
            status
            href
            is_followed
            exhibition_period
            cover_image {
              url
            }
            location {
              coordinates {
                lat
                lng
              }
              __id
            }
            type
            start_at
            end_at
            partner {
              __typename
              ... on Partner {
                name
                type
              }
              ... on Node {
                __id
              }
              ... on ExternalPartner {
                __id
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
    __id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "cursor",
    "type": "String",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "citySlug",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "type",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "CitySavedListQuery",
  "id": "3bf003260850b30b835fbfb8813b3c80",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "CitySavedListQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "viewer",
        "name": "__viewer_viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "CitySavedList_viewer",
            "args": [
              {
                "kind": "Variable",
                "name": "city",
                "variableName": "citySlug",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "count",
                "variableName": "count",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "cursor",
                "variableName": "cursor",
                "type": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CitySavedListQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
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
              v1
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
                    "alias": null,
                    "name": "shows",
                    "storageKey": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "after",
                        "variableName": "cursor",
                        "type": "String"
                      },
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
                        "kind": "Variable",
                        "name": "first",
                        "variableName": "count",
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
                              v2,
                              v1,
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
                                  v2
                                ]
                              },
                              v3,
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
                                  v4,
                                  v2,
                                  {
                                    "kind": "InlineFragment",
                                    "type": "Partner",
                                    "selections": [
                                      v1,
                                      v3
                                    ]
                                  }
                                ]
                              },
                              v4
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
                  },
                  {
                    "kind": "LinkedHandle",
                    "alias": null,
                    "name": "shows",
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "after",
                        "variableName": "cursor",
                        "type": "String"
                      },
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
                        "kind": "Variable",
                        "name": "first",
                        "variableName": "count",
                        "type": "Int"
                      },
                      {
                        "kind": "Literal",
                        "name": "status",
                        "value": "CURRENT",
                        "type": "EventStatus"
                      }
                    ],
                    "handle": "connection",
                    "key": "CitySavedList_shows",
                    "filters": [
                      "status",
                      "dayThreshold",
                      "city"
                    ]
                  }
                ]
              },
              v2
            ]
          }
        ]
      },
      {
        "kind": "LinkedHandle",
        "alias": null,
        "name": "viewer",
        "args": null,
        "handle": "viewer",
        "key": "",
        "filters": null
      }
    ]
  }
};
})();
(node as any).hash = 'e62705bf01c43b189302e3cafe6104b0';
export default node;
