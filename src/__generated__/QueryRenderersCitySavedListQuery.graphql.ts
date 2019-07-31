/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { CitySavedList_viewer$ref } from "./CitySavedList_viewer.graphql";
export type QueryRenderersCitySavedListQueryVariables = {
    readonly citySlug: string;
};
export type QueryRenderersCitySavedListQueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": CitySavedList_viewer$ref;
    } | null;
};
export type QueryRenderersCitySavedListQuery = {
    readonly response: QueryRenderersCitySavedListQueryResponse;
    readonly variables: QueryRenderersCitySavedListQueryVariables;
};



/*
query QueryRenderersCitySavedListQuery(
  $citySlug: String!
) {
  viewer {
    ...CitySavedList_viewer
  }
}

fragment CitySavedList_viewer on Viewer {
  city(slug: $citySlug) {
    name
  }
  me {
    followsAndSaves {
      shows(first: 20, status: RUNNING_AND_UPCOMING, city: $citySlug, after: "") {
        edges {
          node {
            slug
            internalID
            id
            name
            isStubShow
            status
            href
            is_followed: isFollowed
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
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
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
v2 = [
  {
    "kind": "Literal",
    "name": "after",
    "value": ""
  },
  {
    "kind": "Variable",
    "name": "city",
    "variableName": "citySlug"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
  },
  {
    "kind": "Literal",
    "name": "status",
    "value": "RUNNING_AND_UPCOMING"
  }
],
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "type",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersCitySavedListQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
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
            "kind": "FragmentSpread",
            "name": "CitySavedList_viewer",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersCitySavedListQuery",
    "argumentDefinitions": (v0/*: any*/),
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
                "variableName": "citySlug"
              }
            ],
            "concreteType": "City",
            "plural": false,
            "selections": [
              (v1/*: any*/)
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
                    "args": (v2/*: any*/),
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
                              (v3/*: any*/),
                              (v1/*: any*/),
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "isStubShow",
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
                              {
                                "kind": "ScalarField",
                                "alias": "is_followed",
                                "name": "isFollowed",
                                "args": null,
                                "storageKey": null
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
                                  (v3/*: any*/)
                                ]
                              },
                              (v4/*: any*/),
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
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "partner",
                                "storageKey": null,
                                "args": null,
                                "concreteType": null,
                                "plural": false,
                                "selections": [
                                  (v5/*: any*/),
                                  (v3/*: any*/),
                                  {
                                    "kind": "InlineFragment",
                                    "type": "Partner",
                                    "selections": [
                                      (v1/*: any*/),
                                      (v4/*: any*/),
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
                                          },
                                          (v3/*: any*/)
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              },
                              (v5/*: any*/)
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
                    "args": (v2/*: any*/),
                    "handle": "connection",
                    "key": "CitySavedList_shows",
                    "filters": [
                      "status",
                      "city"
                    ]
                  }
                ]
              },
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "QueryRenderersCitySavedListQuery",
    "id": "4569259a4968eb04ee3fb7560bbf5751",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '16104d57df352d994547e7882be5f947';
export default node;
