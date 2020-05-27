/* tslint:disable */
/* eslint-disable */
/* @relayHash 710672c278f608758e4ef75e829022f9 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CitySavedListQueryVariables = {
    citySlug: string;
};
export type CitySavedListQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"CitySavedList_me">;
    } | null;
    readonly city: {
        readonly " $fragmentRefs": FragmentRefs<"CitySavedList_city">;
    } | null;
};
export type CitySavedListQuery = {
    readonly response: CitySavedListQueryResponse;
    readonly variables: CitySavedListQueryVariables;
};



/*
query CitySavedListQuery(
  $citySlug: String!
) {
  me {
    ...CitySavedList_me
    id
  }
  city(slug: $citySlug) {
    ...CitySavedList_city
  }
}

fragment CitySavedList_city on City {
  name
}

fragment CitySavedList_me on Me {
  followsAndSaves {
    shows: showsConnection(first: 20, status: RUNNING_AND_UPCOMING, city: $citySlug, after: "") {
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
v1 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "citySlug"
  }
],
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
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "type",
  "args": null,
  "storageKey": null
},
v6 = {
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
    "name": "CitySavedListQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
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
            "kind": "FragmentSpread",
            "name": "CitySavedList_me",
            "args": null
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "city",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "City",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "CitySavedList_city",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CitySavedListQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
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
                "name": "showsConnection",
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
                          (v4/*: any*/),
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
                          (v5/*: any*/),
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
                              (v6/*: any*/),
                              (v3/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "type": "Partner",
                                "selections": [
                                  (v4/*: any*/),
                                  (v5/*: any*/),
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
                          (v6/*: any*/)
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
                "alias": "shows",
                "name": "showsConnection",
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
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "city",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "City",
        "plural": false,
        "selections": [
          (v4/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CitySavedListQuery",
    "id": "cae6a6cb9787d286516a1b7bdec5e8d9",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'ad04be0805d88778e7f1a0fa74550542';
export default node;
