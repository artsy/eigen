/* tslint:disable */
/* eslint-disable */
/* @relayHash 3b27bc400980ad1139661342fdbf9ee7 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FavoriteCategoriesQueryVariables = {};
export type FavoriteCategoriesQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"FavoriteCategories_me">;
    } | null;
};
export type FavoriteCategoriesQuery = {
    readonly response: FavoriteCategoriesQueryResponse;
    readonly variables: FavoriteCategoriesQueryVariables;
};



/*
query FavoriteCategoriesQuery {
  me {
    ...FavoriteCategories_me
    id
  }
}

fragment FavoriteCategories_me on Me {
  followsAndSaves {
    genes: genesConnection(first: 10) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          gene {
            id
            name
            href
            image {
              url
            }
          }
          id
          __typename
        }
        cursor
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FavoriteCategoriesQuery",
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
            "name": "FavoriteCategories_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FavoriteCategoriesQuery",
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
                "alias": "genes",
                "name": "genesConnection",
                "storageKey": "genesConnection(first:10)",
                "args": (v0/*: any*/),
                "concreteType": "FollowGeneConnection",
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
                    "concreteType": "FollowGeneEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "FollowGene",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "gene",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Gene",
                            "plural": false,
                            "selections": [
                              (v1/*: any*/),
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "name",
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
                                    "args": null,
                                    "storageKey": null
                                  }
                                ]
                              }
                            ]
                          },
                          (v1/*: any*/),
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
              },
              {
                "kind": "LinkedHandle",
                "alias": "genes",
                "name": "genesConnection",
                "args": (v0/*: any*/),
                "handle": "connection",
                "key": "Categories_followed_genes",
                "filters": null
              }
            ]
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FavoriteCategoriesQuery",
    "id": "1f2fe351db671db305e2398c685053b7",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'b2f3835cde1d40fdd22649420a620630';
export default node;
