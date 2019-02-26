/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Shows_me$ref } from "./Shows_me.graphql";
export type FavoriteShowsQueryVariables = {};
export type FavoriteShowsQueryResponse = {
    readonly me: ({
        readonly " $fragmentRefs": Shows_me$ref;
    }) | null;
};
export type FavoriteShowsQuery = {
    readonly response: FavoriteShowsQueryResponse;
    readonly variables: FavoriteShowsQueryVariables;
};



/*
query FavoriteShowsQuery {
  me {
    ...Shows_me
    __id
  }
}

fragment Shows_me on Me {
  followsAndSaves {
    shows(first: 10) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ...SavedShowItemRow_show
          __id
          __typename
        }
        cursor
      }
    }
  }
  __id
}

fragment SavedShowItemRow_show on Show {
  id
  _id
  __id
  is_followed
  name
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on ExternalPartner {
      name
      __id
    }
    ... on Node {
      __id
    }
  }
  href
  status
  images(size: 1) {
    url
  }
  start_at
  end_at
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
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
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v3 = [
  v1
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FavoriteShowsQuery",
  "id": "183aa8e42d89478532cc307001b49d28",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FavoriteShowsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
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
            "name": "Shows_me",
            "args": null
          },
          v0
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FavoriteShowsQuery",
    "argumentDefinitions": [],
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
                "alias": null,
                "name": "shows",
                "storageKey": "shows(first:10)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 10,
                    "type": "Int"
                  }
                ],
                "concreteType": "FollowedShowConnection",
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
                            "name": "href",
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
                          v0,
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_followed",
                            "args": null,
                            "storageKey": null
                          },
                          v1,
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "partner",
                            "storageKey": null,
                            "args": null,
                            "concreteType": null,
                            "plural": false,
                            "selections": [
                              v2,
                              v0,
                              {
                                "kind": "InlineFragment",
                                "type": "ExternalPartner",
                                "selections": v3
                              },
                              {
                                "kind": "InlineFragment",
                                "type": "Partner",
                                "selections": v3
                              }
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "_id",
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
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "images",
                            "storageKey": "images(size:1)",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "size",
                                "value": 1,
                                "type": "Int"
                              }
                            ],
                            "concreteType": "Image",
                            "plural": true,
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
                          v2
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
              },
              {
                "kind": "LinkedHandle",
                "alias": null,
                "name": "shows",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 10,
                    "type": "Int"
                  }
                ],
                "handle": "connection",
                "key": "SavedShows_shows",
                "filters": null
              }
            ]
          },
          v0
        ]
      }
    ]
  }
};
})();
(node as any).hash = '6dbdf618a8913e9625487bb6719e165f';
export default node;
